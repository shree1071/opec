// ─── 3D Avatar Interview Page ───
import TavusAPI from '../api/tavus.js';
import Storage from '../utils/storage.js';

let conversationData = null;

export function renderInterview(container) {
  container.innerHTML = `
    <div class="page interview-page">
      <!-- Header -->
      <div class="interview-header">
        <span class="section-label">3D AI Interview</span>
        <h1 class="section-title">Meet Your AI Interviewer</h1>
        <p class="section-subtitle mx-auto">
          Face-to-face career guidance with an AI avatar that listens, asks smart questions,
          and helps you discover your path.
        </p>
      </div>

      <!-- Video Area -->
      <div class="interview-video-area">
        <div class="video-container" id="video-container">
          <div class="video-placeholder" id="video-placeholder">
            <div class="video-placeholder-icon">🎙️</div>
            <p class="video-placeholder-text">Ready to Begin</p>
            <p class="video-placeholder-sub">Click "Start Interview" to connect with your AI interviewer</p>
          </div>
        </div>
        <div class="video-controls">
          <div class="video-status">
            <span class="status-dot" id="status-dot"></span>
            <span id="status-text">Waiting to connect</span>
          </div>
          <div class="video-actions">
            <button class="btn btn-secondary btn-sm" id="end-interview-btn" style="display:none;">End Session</button>
            <button class="btn btn-primary btn-sm" id="start-interview-btn">▶ Start Interview</button>
          </div>
        </div>
      </div>

      <!-- Setup Panel -->
      <div class="interview-setup">
        <h3 class="setup-title">⚙️ Interview Settings</h3>
        <div class="setup-form">

          <div class="setup-field">
            <label for="interview-topic">Interview Focus</label>
            <select id="interview-topic">
              <option value="career-discovery">Career Discovery</option>
              <option value="role-transition">Role Transition Guidance</option>
              <option value="skill-assessment">Skill Assessment</option>
              <option value="market-insights">Market Insights</option>
            </select>
          </div>
          <div class="setup-field">
            <label for="interview-name">Your Name</label>
            <input type="text" id="interview-name" placeholder="Enter your name" value="${Storage.get().userName || ''}">
          </div>
          <div class="setup-actions">
            <button class="btn btn-secondary btn-sm" id="save-settings-btn">Save Settings</button>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="interview-tips">
        <div class="tip-card">
          <div class="tip-icon">🎯</div>
          <h4 class="tip-title">Be Specific</h4>
          <p class="tip-desc">Share concrete examples from your work experience for better guidance.</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">💡</div>
          <h4 class="tip-title">Stay Open</h4>
          <p class="tip-desc">The AI might suggest unexpected career paths — keep an open mind.</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">📝</div>
          <h4 class="tip-title">Take Notes</h4>
          <p class="tip-desc">Key insights will be summarized, but jot down what resonates most.</p>
        </div>
      </div>
    </div>
  `;

  setupInterviewHandlers();
}

function setupInterviewHandlers() {
  const startBtn = document.getElementById('start-interview-btn');
  const endBtn = document.getElementById('end-interview-btn');
  const saveBtn = document.getElementById('save-settings-btn');

  startBtn.addEventListener('click', startInterview);
  endBtn.addEventListener('click', endInterview);

  saveBtn.addEventListener('click', () => {
    const name = document.getElementById('interview-name').value.trim();
    if (name) Storage.set({ userName: name });

    showToast('Settings saved!');
  });
}

async function startInterview() {
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const startBtn = document.getElementById('start-interview-btn');
  const endBtn = document.getElementById('end-interview-btn');
  const videoContainer = document.getElementById('video-container');

  statusText.textContent = 'Connecting...';
  statusDot.className = 'status-dot';
  startBtn.disabled = true;
  startBtn.textContent = 'Connecting...';

  try {
    const topic = document.getElementById('interview-topic').value;
    const name = document.getElementById('interview-name').value || 'friend';

    const greetings = {
      'career-discovery': `Hi ${name}! I'm your Career Clarity AI guide. I'm excited to help you discover the career path that's truly right for you. Let's start — tell me, what do you currently do and what drew you to it?`,
      'role-transition': `Hello ${name}! I understand you're thinking about a career transition. That takes courage! Let's explore this together — what role are you in now, and what's making you consider a change?`,
      'skill-assessment': `Hey ${name}! Let's do a deep dive into your skills and strengths. Sometimes we undervalue what comes naturally to us. What would you say is the skill you're most proud of?`,
      'market-insights': `Hi ${name}! I'm here to help you understand the current job market and where the opportunities are. What industry or role are you most interested in exploring?`
    };

    const personaId = await TavusAPI.getOrCreatePersona();

    conversationData = await TavusAPI.createConversation({
      name: `Career Clarity - ${topic} - ${name}`,
      greeting: greetings[topic] || greetings['career-discovery'],
      personaId: personaId
    });

    // Show video iframe if conversation URL is returned
    if (conversationData.conversation_url) {
      videoContainer.innerHTML = `
        <iframe 
          src="${conversationData.conversation_url}" 
          allow="camera;microphone;display-capture" 
          style="width:100%;height:100%;border:none;">
        </iframe>
      `;
    } else {
      videoContainer.innerHTML = `
        <div class="video-placeholder">
          <div class="video-placeholder-icon" style="background:rgba(107,143,113,0.2);">✅</div>
          <p class="video-placeholder-text">Session Created</p>
          <p class="video-placeholder-sub">Conversation ID: ${conversationData.conversation_id || 'N/A'}</p>
        </div>
      `;
    }

    statusDot.classList.add('live');
    statusText.textContent = 'Live Session';
    startBtn.style.display = 'none';
    endBtn.style.display = 'inline-flex';

  } catch (err) {
    statusDot.classList.add('error');

    if (err.message === 'TAVUS_KEY_MISSING') {
      statusText.textContent = 'API key required';
      videoContainer.innerHTML = `
        <div class="video-placeholder">
          <div class="video-placeholder-icon" style="background:rgba(199,93,93,0.2);">🔑</div>
          <p class="video-placeholder-text">API Key Required</p>
          <p class="video-placeholder-sub">Enter your Tavus API key in the settings below to start an interview.</p>
        </div>
      `;
    } else {
      statusText.textContent = 'Connection failed';
      videoContainer.innerHTML = `
        <div class="video-placeholder">
          <div class="video-placeholder-icon" style="background:rgba(199,93,93,0.2);">⚠️</div>
          <p class="video-placeholder-text">Connection Failed</p>
          <p class="video-placeholder-sub">${escapeHtml(err.message)}</p>
        </div>
      `;
    }

    startBtn.disabled = false;
    startBtn.textContent = '▶ Start Interview';
  }
}

function endInterview() {
  const videoContainer = document.getElementById('video-container');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const startBtn = document.getElementById('start-interview-btn');
  const endBtn = document.getElementById('end-interview-btn');

  videoContainer.innerHTML = `
    <div class="video-placeholder">
      <div class="video-placeholder-icon">✅</div>
      <p class="video-placeholder-text">Session Complete</p>
      <p class="video-placeholder-sub">Great conversation! Head to the OPEC Chat to continue your career discovery.</p>
    </div>
  `;

  statusDot.className = 'status-dot';
  statusText.textContent = 'Session ended';
  startBtn.style.display = 'inline-flex';
  startBtn.disabled = false;
  startBtn.textContent = '▶ Start Interview';
  endBtn.style.display = 'none';
  conversationData = null;
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
