// ─── Chat Page ───
import GeminiAPI from '../api/gemini.js';
import Storage from '../utils/storage.js';
import { getCurrentAgent, getAgentInfo, getAllAgents } from '../utils/opec.js';

let isTyping = false;

export function renderChat(container) {
  const history = Storage.getChatHistory();
  const currentAgent = getCurrentAgent(history);
  const agents = getAllAgents();

  container.innerHTML = `
    <div class="page chat-page">
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-left">
          <div class="chat-avatar">CC</div>
          <div>
            <div class="chat-header-title">OPEC Career Guide</div>
            <div class="chat-header-status">Online — Agent ${currentAgent} active</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <a href="#/interview" class="btn btn-primary btn-sm" style="text-decoration:none; display:flex; align-items:center; gap:4px;">✨ Practice 3D Interview</a>
          <button class="chat-api-key-btn" id="chat-clear-btn">Clear Chat</button>

        </div>
      </div>

      <!-- Agent Tabs -->
      <div class="agent-tabs">
        ${Object.entries(agents).map(([key, agent]) => `
          <button class="agent-tab ${key === currentAgent ? 'active' : ''}" data-agent="${key}">
            ${agent.emoji} ${agent.name}
          </button>
        `).join('')}
      </div>

      <!-- Messages -->
      <div class="chat-messages" id="chat-messages">
        ${history.length === 0 ? renderWelcome() : history.map(m => renderMessage(m)).join('')}
      </div>

      <!-- Input -->
      <div class="chat-input-area">
        <div class="chat-input-wrapper">
          <textarea class="chat-input" id="chat-input" placeholder="Tell me about your career..." rows="1"></textarea>
          <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  setupChatHandlers();
}

function renderWelcome() {
  return `
    <div class="message assistant">
      <div class="message-avatar">O</div>
      <div class="message-bubble">
        <div class="message-agent-label" style="color:var(--agent-o)">Agent O — Observer</div>
        <p>Welcome to Career Clarity! 👋</p>
        <p style="margin-top:8px;">I'm Agent O, your Observer. I'm here to understand where you are right now in your career journey.</p>
        <p style="margin-top:8px;">Let's start with something simple — <strong>what do you currently do for work, and how does it make you feel?</strong></p>
      </div>
    </div>
  `;
}

function renderMessage(msg) {
  if (msg.role === 'user') {
    return `
      <div class="message user">
        <div class="message-avatar">You</div>
        <div class="message-bubble">${escapeHtml(msg.content)}</div>
      </div>
    `;
  } else {
    const agent = getAgentInfo(msg.agent || 'O');
    return `
      <div class="message assistant">
        <div class="message-avatar">${msg.agent || 'O'}</div>
        <div class="message-bubble">
          <div class="message-agent-label" style="color:${agent.color}">${agent.fullName}</div>
          ${formatResponse(msg.content)}
        </div>
      </div>
    `;
  }
}

function renderTypingIndicator() {
  return `
    <div class="message assistant" id="typing-msg">
      <div class="message-avatar">...</div>
      <div class="message-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;
}

function setupChatHandlers() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  const clearBtn = document.getElementById('chat-clear-btn');
  const messages = document.getElementById('chat-messages');

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  // Send on Enter (not Shift+Enter)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);



  // Clear chat
  clearBtn.addEventListener('click', () => {
    Storage.clearChat();
    renderChat(document.getElementById('app'));
  });

  // Scroll to bottom
  scrollToBottom();
}

async function sendMessage() {
  if (isTyping) return;

  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const userText = input.value.trim();

  if (!userText) return;

  // Clear input
  input.value = '';
  input.style.height = 'auto';

  // Remove welcome if present
  const welcome = messages.querySelector('.message.assistant:only-child');

  // Add user message
  Storage.addChatMessage('user', userText);
  messages.insertAdjacentHTML('beforeend', renderMessage({ role: 'user', content: userText }));

  // Show typing
  isTyping = true;
  messages.insertAdjacentHTML('beforeend', renderTypingIndicator());
  scrollToBottom();
  document.getElementById('chat-send-btn').disabled = true;

  try {
    const history = Storage.getChatHistory();
    const result = await GeminiAPI.sendMessage(userText, history.slice(0, -1));

    // Remove typing indicator
    document.getElementById('typing-msg')?.remove();

    // Save and render response
    Storage.addChatMessage('assistant', result.text, result.agent);
    messages.insertAdjacentHTML('beforeend', renderMessage({
      role: 'assistant',
      content: result.text,
      agent: result.agent
    }));

    // Update agent tabs
    updateAgentTabs(result.agent);

  } catch (err) {
    document.getElementById('typing-msg')?.remove();

    if (err.message === 'GEMINI_KEY_MISSING') {
      messages.insertAdjacentHTML('beforeend', `
        <div class="message assistant">
          <div class="message-avatar" style="background:var(--error)">!</div>
          <div class="message-bubble">
            <p style="color:var(--error)">⚠️ API Key Missing</p>
            <p style="margin-top:6px;font-size:0.85rem;">Please configure your Gemini API key securely in config.js.</p>
          </div>
        </div>
      `);
    } else {
      messages.insertAdjacentHTML('beforeend', `
        <div class="message assistant">
          <div class="message-avatar" style="background:var(--error)">!</div>
          <div class="message-bubble">
            <p style="color:var(--error)">⚠️ ${escapeHtml(err.message)}</p>
            <p style="margin-top:6px;font-size:0.85rem;">Please check your API key and try again.</p>
          </div>
        </div>
      `);
    }
  } finally {
    isTyping = false;
    document.getElementById('chat-send-btn').disabled = false;
    scrollToBottom();
  }
}

function updateAgentTabs(activeAgent) {
  document.querySelectorAll('.agent-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.agent === activeAgent);
  });
  const status = document.querySelector('.chat-header-status');
  if (status) status.textContent = `Online — Agent ${activeAgent} active`;
}


function scrollToBottom() {
  const messages = document.getElementById('chat-messages');
  if (messages) {
    setTimeout(() => {
      messages.scrollTop = messages.scrollHeight;
    }, 50);
  }
}

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/^/gm, '<p style="margin-top:4px;">')
    .replace(/<p style="margin-top:4px;"><br>/g, '<br>');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
  }
}
