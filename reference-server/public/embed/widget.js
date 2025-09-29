const state = {
  parentOrigin: '*',
  ready: false,
  pending: new Map(),
  messageId: 1,
  handshakeTimeout: null,
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
  window.parent.postMessage({ type: 'OZ_CHAT_LOG', message }, state.parentOrigin);
}

function sendHandshake() {
  window.parent.postMessage(
    {
      type: 'OZ_CHAT_HELLO',
      protocolVersion: '1.0',
    },
    '*'
  );

  state.handshakeTimeout = window.setTimeout(() => {
    statusEl.textContent = 'Connection timeout. Retrying...';
    sendHandshake();
  }, 5000);
}

function handleAck(event) {
  clearTimeout(state.handshakeTimeout);
  state.ready = true;
  state.parentOrigin = event.origin || '*';
  statusEl.textContent = 'Connected to host';
  addMessage('system', 'Connected to host');
}

function handleResponse(message) {
  const pending = state.pending.get(message.id);
  if (!pending) {
    console.warn('[Widget] Unknown response id:', message.id);
    return;
  }
  state.pending.delete(message.id);

  if (message.error) {
    pending.reject(new Error(message.error.message || 'Tool call failed'));
    return;
  }

  pending.resolve(message.result);
}

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  switch (data.type) {
    case 'OZ_CHAT_ACK':
      handleAck(event);
      break;
    case 'OZ_CHAT_RESPONSE':
      handleResponse(data);
      break;
    default:
      break;
  }
});

function sendRequest(tool, args) {
  if (!state.ready) {
    return Promise.reject(new Error('Not connected to host'));
  }

  const id = `req-${state.messageId++}`;
  const payload = {
    type: 'OZ_CHAT_REQUEST',
    request: {
      id,
      tool,
      args,
    },
  };

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      state.pending.delete(id);
      reject(new Error('Request timed out'));
    }, 15000);

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

    window.parent.postMessage(payload, state.parentOrigin);
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

    if (/dark mode|switch to dark/i.test(text)) {
      tool = 'update_theme';
      args = { value: 'dark' };
    } else if (/light mode|switch to light/i.test(text)) {
      tool = 'update_theme';
      args = { value: 'light' };
    } else {
      const match = text.match(/set name to (.+)/i);
      if (match) {
        tool = 'update_name';
        args = { value: match[1].trim() };
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
sendHandshake();
