const state = {
  parentOrigin: '*',
  ready: false,
  pending: new Map(),
  messageId: 1,
  handshakeTimeout: null,
  lastNonce: null,
  sessionId: null,
};

const statusEl = document.getElementById('status');
const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('chat-input');

function addMessage(role, text) {
  const el = document.createElement('div');
  el.className = `message ${role}`;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function log(message) {
  window.parent.postMessage({ type: 'MCP_WIDGET_LOG', message }, state.parentOrigin);
}

function send(payload) {
  window.parent.postMessage(payload, state.parentOrigin);
}

function scheduleHelloRetry() {
  state.handshakeTimeout = window.setTimeout(() => {
    if (state.ready) return;
    statusEl.textContent = 'Connection timeout. Retrying handshake...';
    sendClientHello();
  }, 5000);
}

function sendClientHello() {
  window.clearTimeout(state.handshakeTimeout);
  state.parentOrigin = '*';
  send({
    type: 'client_hello',
    version: '1.0',
    capabilities: {
      model: { request: { stream: false } },
      tools: { call: true },
    },
  });
  scheduleHelloRetry();
}

function beginSetup() {
  state.lastNonce = `nonce-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  log('Sending MCP_SETUP_HANDSHAKE to parent.');
  send({
    type: 'MCP_SETUP_HANDSHAKE',
    nonce: state.lastNonce,
    version: '1.0',
  });
}

function completeSetup(sessionId) {
  state.sessionId = sessionId || state.sessionId || `session-${Date.now()}`;
  log('Transport handshake complete. Sending MCP_TRANSPORT_ACCEPTED.');
  send({
    type: 'MCP_TRANSPORT_ACCEPTED',
    sessionId: state.sessionId,
  });
  state.ready = true;
  window.clearTimeout(state.handshakeTimeout);
  statusEl.textContent = 'Connected to host';
  addMessage('system', 'Connected to host');
}

function handleJsonRpcResponse(payload) {
  const responseId = payload.id != null ? String(payload.id) : null;
  if (!responseId) {
    log('Received MCP_MESSAGE response without id.');
    return;
  }

  const pending = state.pending.get(responseId);
  if (!pending) {
    log(`Unknown response id ${responseId}`);
    return;
  }

  state.pending.delete(responseId);

  if (payload.error) {
    const message = payload.error.message || 'Tool call failed';
    pending.reject(new Error(message));
  } else {
    pending.resolve(payload.result);
  }
}

function handleJsonRpcRequest(payload) {
  if (!payload || typeof payload !== 'object') return;

  const id = payload.id != null ? String(payload.id) : null;
  if (!id || !payload.method) {
    log('Widget received JSON-RPC request without id/method.');
    return;
  }

  const errorFrame = (code, message) => ({
    type: 'MCP_MESSAGE',
    payload: {
      jsonrpc: '2.0',
      id,
      error: { code, message },
    },
  });

  if (payload.method !== 'widget/log') {
    log(`Unsupported request method from parent: ${payload.method}`);
  }

  send(errorFrame(-32601, 'Method not supported by widget'));
}

function handleTransportFrame(message, origin) {
  if (origin) {
    state.parentOrigin = origin;
  }

  switch (message.type) {
    case 'server_hello':
      log('Received server_hello from parent host.');
      break;

    case 'MCP_SETUP_REQUIRED':
      log('Parent requested setup handshake.');
      if (state.pending.size) {
        const error = new Error('Connection reset during handshake');
        state.pending.forEach(({ reject }) => reject(error));
        state.pending.clear();
      }
      state.ready = false;
      beginSetup();
      break;

    case 'MCP_SETUP_HANDSHAKE_REPLY':
      if (!state.lastNonce || message.nonce !== state.lastNonce) {
        log('Received setup handshake reply with unexpected nonce.');
        return;
      }
      log('Setup handshake acknowledged. Sending MCP_SETUP_COMPLETE.');
      state.sessionId = `session-${Date.now()}`;
      send({
        type: 'MCP_SETUP_COMPLETE',
        sessionId: state.sessionId,
      });
      break;

    case 'MCP_TRANSPORT_HANDSHAKE_REPLY':
      completeSetup(message.sessionId);
      break;

    case 'MCP_PHASE':
      // Parent is probing for transport readiness; respond by resending handshake if needed.
      if (!state.ready) beginSetup();
      break;

    case 'MCP_MESSAGE':
      if (!message.payload || typeof message.payload !== 'object') return;
      if (message.payload.method) {
        handleJsonRpcRequest(message.payload);
      } else {
        handleJsonRpcResponse(message.payload);
      }
      break;

    case 'error':
      if (message.error?.message) {
        log(`Received error from parent: ${message.error.message}`);
      }
      break;

    default:
      break;
  }
}

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'MCP_MESSAGE' || String(data.type || '').startsWith('MCP_') || data.type === 'server_hello') {
    handleTransportFrame(data, event.origin || '*');
    return;
  }

  if (data.type === 'client_hello') {
    // Ignore stray client_hello echoes to avoid loops.
    return;
  }
});

function sendTransportRequest(payload) {
  if (!state.ready) {
    return Promise.reject(new Error('Not connected to host'));
  }

  const id = payload.id != null ? String(payload.id) : `req-${state.messageId++}`;
  payload.id = id;

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      state.pending.delete(id);
      reject(new Error('Request timed out'));
    }, 20000);

    state.pending.set(id, {
      resolve: (value) => {
        window.clearTimeout(timeout);
        resolve(value);
      },
      reject: (error) => {
        window.clearTimeout(timeout);
        reject(error);
      },
    });

    send({
      type: 'MCP_MESSAGE',
      payload,
    });
  });
}

function sendRequest(tool, args) {
  if (tool === 'model_request') {
    const params = {
      prompt: args?.prompt || '',
    };

    if (args?.model) {
      params.model = args.model;
    }

    if (args?.messages) {
      params.messages = args.messages;
    }

    if (args?.system) {
      params.system = args.system;
    }

    return sendTransportRequest({
      jsonrpc: '2.0',
      method: 'model_request',
      params,
    });
  }

  return sendTransportRequest({
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: tool,
      arguments: args || {},
    },
  });
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = '';
  addMessage('user', text);

  try {
    let tool;
    let args;

    const normalized = text.toLowerCase();
    const darkRequest =
      /(dark\s*(mode|theme)|switch\s+to\s+dark|enable\s+dark|make\s+it\s+dark)/i.test(text) ||
      (normalized.includes('dark') && normalized.includes('theme'));
    const lightRequest =
      /(light\s*(mode|theme)|switch\s+to\s+light|enable\s+light|make\s+it\s+light)/i.test(text) ||
      (normalized.includes('light') && normalized.includes('theme'));

    if (darkRequest) {
      tool = 'update_theme';
      args = { value: 'dark' };
    } else if (lightRequest) {
      tool = 'update_theme';
      args = { value: 'light' };
    } else {
      const nameMatch = text.match(/^(?:set\s+(?:my\s+)?)?name\s+to\s+(.+)/i) || text.match(/^call\s+me\s+(.+)/i);
      if (nameMatch) {
        tool = 'update_name';
        const value = nameMatch[1].trim().replace(/[.!?]+$/, '');
        args = { value };
      } else {
        tool = 'model_request';
        args = { prompt: text };
      }
    }

    const result = await sendRequest(tool, args);
    if (result && Array.isArray(result.content)) {
      const textContent = result.content
        .map((c) => (c.text ? c.text : JSON.stringify(c)))
        .join(' ');
      addMessage('assistant', textContent || '(no response)');
    } else {
      addMessage('assistant', '(tool executed)');
    }
  } catch (error) {
    addMessage('system', `Error: ${error.message}`);
  }
});

addMessage('system', 'Widget loaded, waiting for host...');
statusEl.textContent = 'Connecting to host...';
sendClientHello();
