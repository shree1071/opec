// ─── Dashboard Page ───
import Storage from '../utils/storage.js';

const MOCK_JOBS = [
  { company: 'Infosys', role: 'Senior Software Engineer', salary: '₹18–25 LPA', location: 'Bangalore', type: 'Full-time' },
  { company: 'Flipkart', role: 'Product Manager', salary: '₹22–32 LPA', location: 'Bangalore', type: 'Full-time' },
  { company: 'Razorpay', role: 'Data Scientist', salary: '₹20–28 LPA', location: 'Bangalore', type: 'Full-time' },
  { company: 'Swiggy', role: 'UX Designer', salary: '₹14–20 LPA', location: 'Bangalore', type: 'Full-time' },
  { company: 'Zerodha', role: 'Backend Developer', salary: '₹16–24 LPA', location: 'Bangalore', type: 'Remote' },
  { company: 'CRED', role: 'ML Engineer', salary: '₹24–35 LPA', location: 'Bangalore', type: 'Hybrid' }
];

export function renderDashboard(container) {
  const state = Storage.get();
  const greeting = getGreeting();
  const name = state.userName || 'Explorer';

  container.innerHTML = `
    <div class="page dashboard">
      <!-- Greeting -->
      <div class="dash-greeting">
        <p class="dash-greeting-label">${greeting}</p>
        <h1 class="dash-greeting-title">Welcome back, <span>${name}</span></h1>
        <p class="dash-greeting-subtitle">Your career clarity journey continues. Choose a tool to explore.</p>
      </div>

      <!-- Feature Cards -->
      <div class="dash-grid">
        <div class="dash-card" onclick="location.hash='#/interview'" id="card-interview">
          <div class="dash-card-icon">🎥</div>
          <h2 class="dash-card-title">3D AI Interview</h2>
          <p class="dash-card-desc">
            Practice interviews with a lifelike AI avatar. Get real-time feedback on your responses, 
            body language tips, and career-specific coaching.
          </p>
          <span class="dash-card-action">Launch Interview <span>→</span></span>
        </div>

        <div class="dash-card" onclick="location.hash='#/chat'" id="card-chat">
          <div class="dash-card-icon">💬</div>
          <h2 class="dash-card-title">Career Clarity Chat</h2>
          <p class="dash-card-desc">
            Have a guided conversation with our OPEC AI agents. They'll observe, analyze patterns, 
            evaluate options, and deliver your clarity plan.
          </p>
          <span class="dash-card-action">Start Chatting <span>→</span></span>
        </div>

        <div class="dash-card" onclick="location.hash='#/simulator'" id="card-simulator">
          <div class="dash-card-icon">📈</div>
          <h2 class="dash-card-title">Career Simulator</h2>
          <p class="dash-card-desc">
            See where your career could take you over the next 5 years. Visualize salary growth, 
            role progression, and skill milestones on an interactive timeline.
          </p>
          <span class="dash-card-action">Simulate Career <span>→</span></span>
        </div>
      </div>

      <!-- Market Data -->
      <div class="dash-market">
        <h2 class="dash-market-title">📍 Live Market — Bangalore</h2>
        <div class="market-grid">
          ${MOCK_JOBS.map(job => `
            <div class="market-card">
              <div class="market-card-company">${job.company}</div>
              <div class="market-card-role">${job.role}</div>
              <div class="market-card-details">
                <span class="market-card-salary">${job.salary}</span>
                <span>${job.location} · ${job.type}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️ Good morning';
  if (hour < 17) return '🌤️ Good afternoon';
  return '🌙 Good evening';
}
