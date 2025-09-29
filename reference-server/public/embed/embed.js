(function () {
  const DEFAULT_WIDTH = 360;
  const DEFAULT_HEIGHT = 420;

  const state = {
    iframe: null,
    iframeOrigin: '*',
    ready: false,
    pending: new Map(),
    requestHandler: null,
    requestCounter: 1,
    readyResolvers: [],
  };

  function createIframe(options = {}) {
    const iframe = document.createElement('iframe');
    iframe.src = options.src || '/embed/widget.html';
    iframe.width = String(options.width || DEFAULT_WIDTH);
    iframe.height = String(options.height || DEFAULT_HEIGHT);
    iframe.style.border = '0';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 20px 50px rgba(15, 23, 42, 0.12)';
    iframe.setAttribute('title', options.title || 'Ozwell Chat');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    return iframe;
  }

  function mountIframe(options = {}) {
    if (state.iframe) return state.iframe;

    const container =
      document.getElementById(options.containerId || 'chatbot') ||
      document.getElementById('ozwell-chat-container') ||
      document.body;
    const iframe = createIframe(options);
    container.appendChild(iframe);
    state.iframe = iframe;
    return iframe;
  }

  function normalizeResult(result) {
    if (!result) {
      return {
        content: [{ type: 'text', text: '' }],
        metadata: {},
      };
    }

    if (typeof result === 'string') {
      return {
        content: [{ type: 'text', text: result }],
        metadata: {},
      };
    }

    if (Array.isArray(result)) {
      return {
        content: result,
        metadata: {},
      };
    }

    if (result.content) {
      return {
        content: result.content,
        metadata: result.metadata || {},
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      metadata: {},
    };
  }

  function sendToIframe(payload) {
    if (!state.iframe || !state.iframe.contentWindow) return;
    state.iframe.contentWindow.postMessage(payload, state.iframeOrigin);
  }

  function handleIframeMessage(event) {
    if (!state.iframe) return;
    if (event.source !== state.iframe.contentWindow) return;

    const data = event.data;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'OZ_CHAT_HELLO': {
        state.iframeOrigin = event.origin || '*';
        state.ready = true;
        sendToIframe({
          type: 'OZ_CHAT_ACK',
          protocolVersion: '1.0',
          capabilities: {
            tools: {
              call: true,
            },
          },
        });
        state.readyResolvers.forEach((resolve) => resolve());
        state.readyResolvers = [];
        document.dispatchEvent(new CustomEvent('ozwell-chat-ready'));
        break;
      }

      case 'OZ_CHAT_REQUEST': {
        const request = data.request;
        if (!request || !request.id) {
          console.warn('[OzwellChat] Received invalid request payload:', data);
          return;
        }
        const handler = state.requestHandler || defaultRequestHandler;
        Promise.resolve(handler(request))
          .then((response) => {
            const normalized = normalizeResult(response);
            sendToIframe({
              type: 'OZ_CHAT_RESPONSE',
              id: request.id,
              result: normalized,
            });
          })
          .catch((error) => {
            sendToIframe({
              type: 'OZ_CHAT_RESPONSE',
              id: request.id,
              error: {
                message: error && error.message ? error.message : 'Tool call failed',
              },
            });
          });
        break;
      }

      case 'OZ_CHAT_LOG': {
        console.log('[OzwellChat][Iframe]', data.message);
        break;
      }

      default:
        break;
    }
  }

  function defaultRequestHandler(request) {
    if (request.tool === 'model_request') {
      const prompt = request.args && request.args.prompt ? request.args.prompt : '';
      return `Echo: ${prompt}`;
    }

    return `Tool ${request.tool} executed`;
  }

  function ensureListeners() {
    window.addEventListener('message', handleIframeMessage);
  }

  ensureListeners();

  const api = {
    /**
     * Mounts the chat widget. Call this if you need to control where the iframe is injected.
     */
    mount(options = {}) {
      return mountIframe(options);
    },

    /**
     * Registers a handler for incoming tool calls/model requests.
     * The handler receives an object: { id, tool, args }
     * Return a string or { content, metadata } to send back to the widget.
     */
    onRequest(handler) {
      state.requestHandler = handler;
    },

    /**
     * Resolves once the iframe has completed its handshake with the parent.
     */
    ready() {
      if (state.ready) return Promise.resolve();
      return new Promise((resolve) => {
        state.readyResolvers.push(resolve);
      });
    },
  };

  // Auto-mount on load
  document.addEventListener('DOMContentLoaded', () => {
    mountIframe();
  });

  window.OzwellChat = api;
})();
