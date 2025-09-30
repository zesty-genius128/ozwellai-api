const state = {
  config: {
    title: 'Ozwell Assistant',
    placeholder: 'Ask a question...',
    model: 'llama3',
    endpoint: '/embed/chat',
  },
  messages: [],
  sending: false,
};

const statusEl = document.getElementById('status');
const titleEl = document.querySelector('.chat-header');
const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('chat-input');
const submitButton = document.querySelector('.chat-submit');

function setStatus(text) {
  if (statusEl) {
    statusEl.textContent = text;
  }
}

function addMessage(role, text) {
  if (!messagesEl) return;
  const el = document.createElement('div');
  el.className = `message ${role}`;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function applyConfig(config) {
  state.config = {
    ...state.config,
    ...config,
  };

  if (titleEl) {
    titleEl.textContent = state.config.title || 'Ozwell Assistant';
  }

  if (inputEl) {
    inputEl.placeholder = state.config.placeholder || 'Ask a question...';
  }

  setStatus('Ready');
}

function buildMessages() {
  const history = [...state.messages];
  if (state.config.system) {
    const hasSystem = history.some((msg) => msg.role === 'system');
    if (!hasSystem) {
      history.unshift({ role: 'system', content: state.config.system });
    }
  }
  return history;
}

async function sendMessage(text) {
  if (state.sending) return;

  const userMessage = { role: 'user', content: text };
  state.messages.push(userMessage);
  addMessage('user', text);
  setStatus('Thinking...');
  state.sending = true;
  formEl?.classList.add('is-sending');
  submitButton?.setAttribute('disabled', 'true');

  try {
    const response = await fetch(state.config.endpoint || '/embed/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: state.config.model,
        system: state.config.system,
        messages: buildMessages(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    if (payload.error) {
      throw new Error(payload.error.message || 'Model request failed');
    }

    if (payload.warning) {
      addMessage('system', payload.warning);
    }

    const assistantContent = payload.message?.content || '(no response)';
    const assistantMessage = {
      role: payload.message?.role || 'assistant',
      content: assistantContent,
    };

    state.messages.push(assistantMessage);
    addMessage('assistant', assistantContent);
    setStatus('Ready');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    addMessage('system', `Error: ${message}`);
    setStatus('Error');
  } finally {
    state.sending = false;
    formEl?.classList.remove('is-sending');
    submitButton?.removeAttribute('disabled');
  }
}

function handleSubmit(event) {
  event.preventDefault();
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = '';
  sendMessage(text);
}

function handleParentMessage(event) {
  const data = event.data;
  if (!data || typeof data !== 'object') return;
  if (data.source !== 'ozwell-chat-parent') return;

  if (data.type === 'config' && data.payload?.config) {
    applyConfig(data.payload.config);
  }
}

function notifyReady() {
  window.parent.postMessage({
    source: 'ozwell-chat-widget',
    type: 'ready',
  }, '*');
}

window.addEventListener('message', handleParentMessage);
formEl?.addEventListener('submit', handleSubmit);

addMessage('system', 'Widget loaded. Waiting for configuration...');
setStatus('Waiting for host...');
notifyReady();
