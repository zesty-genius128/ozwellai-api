const state = {
  config: {
    title: 'Ozwell',
    placeholder: 'Ask a question...',
    model: 'llama3',
    endpoint: '/embed/chat',
  },
  messages: [],
  sending: false,
  formData: null, // Form context from parent page
};

console.log('[widget.js] Widget initializing...');

const statusEl = document.getElementById('status');
const titleEl = document.querySelector('.chat-header');
const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('chat-input');
const submitButton = document.querySelector('.chat-submit');
const saveButton = document.getElementById('save-button');

let lastAssistantMessage = '';

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
  saveButton?.setAttribute('disabled', 'true');
  lastAssistantMessage = '';

  // Build system prompt with form context
  let systemPrompt = state.config.system || 'You are a helpful assistant.';

  if (state.formData) {
    console.log('[widget.js] Including form context in request:', state.formData);
    systemPrompt = `You are a helpful assistant. You have access to the following user information:

Name: ${state.formData.name}
Address: ${state.formData.address}
Zip Code: ${state.formData.zipCode}

When the user asks about their name, address, or zip code, use this information to answer. Be concise and friendly.`;
  }

  try {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if OpenAI API key is provided
    if (state.config.openaiApiKey) {
      headers['Authorization'] = `Bearer ${state.config.openaiApiKey}`;
      console.log('[widget.js] Using OpenAI API with authorization');
    }

    // Build messages for request (OpenAI format includes system in messages array)
    const requestMessages = buildMessages();
    if (state.config.openaiApiKey && systemPrompt) {
      // OpenAI format: system message in messages array
      requestMessages.unshift({ role: 'system', content: systemPrompt });
    }

    // Build request body
    const requestBody = state.config.openaiApiKey
      ? {
          model: state.config.model,
          messages: requestMessages,
        }
      : {
          model: state.config.model,
          system: systemPrompt,
          messages: buildMessages(),
        };

    const response = await fetch(state.config.endpoint || '/embed/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[widget.js] API error:', errorText);
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const payload = await response.json();
    console.log('[widget.js] API response:', payload);

    // Handle errors
    if (payload.error) {
      throw new Error(payload.error.message || 'Model request failed');
    }

    if (payload.warning) {
      addMessage('system', payload.warning);
    }

    // Parse response based on format (OpenAI vs Ollama)
    let assistantContent;
    if (payload.choices && payload.choices[0]) {
      // OpenAI format
      assistantContent = payload.choices[0].message?.content || '(no response)';
    } else if (payload.message) {
      // Ollama format
      assistantContent = payload.message.content || '(no response)';
    } else {
      assistantContent = '(no response)';
    }

    const assistantMessage = {
      role: 'assistant',
      content: assistantContent,
    };

    state.messages.push(assistantMessage);
    lastAssistantMessage = assistantContent;
    addMessage('assistant', assistantContent);
    setStatus('Ready');
    if (assistantContent.trim()) {
      saveButton?.removeAttribute('disabled');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    addMessage('system', `Error: ${message}`);
    setStatus('Error');
  } finally {
    state.sending = false;
    formEl?.classList.remove('is-sending');
    submitButton?.removeAttribute('disabled');
    if (!lastAssistantMessage.trim()) {
      saveButton?.setAttribute('disabled', 'true');
    }
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

  // Handle state updates from parent page (app.js)
  if (data.type === 'STATE_UPDATE' && data.state) {
    console.log('[widget.js] Received state update from parent:', data.state);

    if (data.state.formData) {
      state.formData = data.state.formData;
      console.log('[widget.js] Form data stored:', state.formData);
    }
    return;
  }

  // Handle legacy messages from embed system
  if (data.source !== 'ozwell-chat-parent') return;

  if (data.type === 'config' && data.payload?.config) {
    applyConfig(data.payload.config);
  }

  if (data.type === 'close') {
    window.parent.postMessage({
      source: 'ozwell-chat-widget',
      type: 'closed',
    }, '*');
  }
}

function notifyReady() {
  // Send IFRAME_READY to register with app.js StateBroker
  window.parent.postMessage({
    type: 'IFRAME_READY',
  }, '*');

  console.log('[widget.js] Sent IFRAME_READY to parent');

  // Also send legacy ready message for embed system
  window.parent.postMessage({
    source: 'ozwell-chat-widget',
    type: 'ready',
  }, '*');
}

function handleSave() {
  if (!lastAssistantMessage.trim()) return;

  window.parent.postMessage({
    source: 'ozwell-chat-widget',
    type: 'insert',
    payload: {
      text: lastAssistantMessage,
      close: true,
    },
  }, '*');

  setStatus('Sent to host');
}

window.addEventListener('message', handleParentMessage);
formEl?.addEventListener('submit', handleSubmit);
saveButton?.addEventListener('click', handleSave);

addMessage('system', 'Widget loaded. Waiting for configuration...');
setStatus('Waiting for host...');

// Initialize IframeSyncClient
if (typeof IframeSyncClient !== 'undefined') {
  console.log('[widget.js] Initializing IframeSyncClient...');

  const iframeClient = new IframeSyncClient('ozwell-widget', function(payload, isOwnMessage, isReadyReceived) {
    console.log('[widget.js] Received state from broker:', { payload, isOwnMessage, isReadyReceived });

    if (payload && payload.formData) {
      state.formData = payload.formData;
      console.log('[widget.js] Form data updated:', state.formData);
    }
  });

  // Register with broker
  iframeClient.ready();
  console.log('[widget.js] IframeSyncClient registered with broker');
} else {
  console.warn('[widget.js] IframeSyncClient not available');
}

// Legacy ready notification for embed system
notifyReady();
