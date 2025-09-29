(function () {
  const DEFAULT_WIDTH = 360;
  const DEFAULT_HEIGHT = 420;

  const state = {
    iframe: null,
    iframeOrigin: '*',
    ready: false,
    pending: new Map(),
    requestHandler: null,
    readyResolvers: [],
    sessionId: null,
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
      const normalized = {
        content: result.content,
        metadata: result.metadata || {},
      };
      if (result.usage) {
        normalized.usage = result.usage;
      }
      return normalized;
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      metadata: {},
    };
  }

  function postToIframe(payload, overrideOrigin) {
    if (!state.iframe || !state.iframe.contentWindow) return;
    const targetOrigin = overrideOrigin || state.iframeOrigin || '*';
    state.iframe.contentWindow.postMessage(payload, targetOrigin);
  }

  function sendToIframe(payload) {
    postToIframe(payload);
  }

  function resetHandshake() {
    state.ready = false;
    state.sessionId = null;
  }

  function setReady() {
    if (state.ready) return;
    state.ready = true;
    state.readyResolvers.splice(0).forEach((resolve) => resolve());
    document.dispatchEvent(new CustomEvent('ozwell-chat-ready'));
  }

  function sendServerHello() {
    sendToIframe({
      type: 'server_hello',
      version: '1.0',
      capabilities: {
        model: {
          request: {
            stream: false,
          },
        },
        tools: {
          call: true,
        },
      },
    });
  }

  function sendSetupRequired() {
    resetHandshake();
    sendToIframe({ type: 'MCP_SETUP_REQUIRED' });
  }

  function sendSetupHandshakeReply(nonce) {
    sendToIframe({
      type: 'MCP_SETUP_HANDSHAKE_REPLY',
      nonce,
    });
  }

  function sendTransportHandshakeReply() {
    const sessionId = state.sessionId || `session-${Date.now()}`;
    state.sessionId = sessionId;
    sendToIframe({
      type: 'MCP_TRANSPORT_HANDSHAKE_REPLY',
      protocolVersion: '1.0',
      sessionId,
    });
  }

  function sendJsonRpcResponse(id, result) {
    sendToIframe({
      type: 'MCP_MESSAGE',
      payload: {
        jsonrpc: '2.0',
        id,
        result,
      },
    });
  }

  function sendJsonRpcError(id, code, message) {
    sendToIframe({
      type: 'MCP_MESSAGE',
      payload: {
        jsonrpc: '2.0',
        id,
        error: {
          code,
          message,
        },
      },
    });
  }

  function handleWidgetResponse(payload) {
    const id = payload.id != null ? String(payload.id) : null;
    if (!id) return;
    const pending = state.pending.get(id);
    if (!pending) return;
    state.pending.delete(id);

    if (payload.error) {
      pending.reject(new Error(payload.error.message || 'Widget request failed'));
    } else {
      pending.resolve(payload.result);
    }
  }

  function handleWidgetRequest(payload) {
    if (!payload || typeof payload !== 'object') return;

    const id = payload.id != null ? String(payload.id) : null;
    const method = typeof payload.method === 'string' ? payload.method : null;
    if (!id || !method) {
      if (id) {
        sendJsonRpcError(id, -32600, 'Invalid request');
      }
      return;
    }

    let tool = method;
    let args = payload.params || {};

    if (method === 'tools/call') {
      tool = payload.params?.name || 'unknown';
      args = payload.params?.arguments || {};
    }

    const handler = state.requestHandler || defaultRequestHandler;
    const requestForHandler = {
      id,
      method,
      params: payload.params || {},
      tool,
      args,
      raw: payload,
    };

    Promise.resolve()
      .then(() => handler(requestForHandler))
      .then((response) => {
        if (response && typeof response === 'object' && response.jsonrpc === '2.0') {
          sendToIframe({ type: 'MCP_MESSAGE', payload: response });
          return;
        }

        const normalized = normalizeResult(response);
        sendJsonRpcResponse(id, normalized);
      })
      .catch((error) => {
        const message = error && error.message ? error.message : 'Tool call failed';
        sendJsonRpcError(id, -32003, message);
      });
  }

  function handleClientHello(event) {
    state.iframeOrigin = event.origin || '*';
    sendServerHello();
    sendSetupRequired();
  }

  function handleSetupMessage(message) {
    switch (message.type) {
      case 'MCP_SETUP_HANDSHAKE': {
        const nonce = message.nonce;
        if (!nonce) return;
        sendSetupHandshakeReply(nonce);
        break;
      }
      case 'MCP_SETUP_COMPLETE': {
        state.sessionId = message.sessionId || state.sessionId;
        sendTransportHandshakeReply();
        break;
      }
      case 'MCP_TRANSPORT_ACCEPTED': {
        if (message.sessionId) {
          state.sessionId = message.sessionId;
        }
        setReady();
        break;
      }
      case 'MCP_TRANSPORT_HANDSHAKE': {
        // Provide an idempotent reply for eager clients.
        state.sessionId = message.sessionId || state.sessionId;
        sendTransportHandshakeReply();
        break;
      }
      default:
        break;
    }
  }

  function handleIframeMessage(event) {
    if (!state.iframe || event.source !== state.iframe.contentWindow) return;
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'client_hello':
        handleClientHello(event);
        break;
      case 'MCP_SETUP_HANDSHAKE':
      case 'MCP_SETUP_COMPLETE':
      case 'MCP_TRANSPORT_ACCEPTED':
      case 'MCP_TRANSPORT_HANDSHAKE':
        handleSetupMessage(data);
        break;
      case 'MCP_QUERY_PHASE':
        sendToIframe({ type: 'MCP_PHASE', phase: state.ready ? 'transport' : 'setup' });
        if (!state.ready) sendSetupRequired();
        break;
      case 'MCP_MESSAGE':
        if (data.payload && typeof data.payload === 'object') {
          if (data.payload.method) {
            handleWidgetRequest(data.payload);
          } else {
            handleWidgetResponse(data.payload);
          }
        }
        break;
      case 'MCP_WIDGET_LOG':
        console.log('[OzwellChat][Widget]', data.message);
        break;
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
    mount(options = {}) {
      return mountIframe(options);
    },
    onRequest(handler) {
      state.requestHandler = handler;
    },
    ready() {
      if (state.ready) return Promise.resolve();
      return new Promise((resolve) => {
        state.readyResolvers.push(resolve);
      });
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    mountIframe();
  });

  window.OzwellChat = api;
})();
