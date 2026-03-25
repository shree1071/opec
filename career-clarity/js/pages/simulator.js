// ─── Career Simulator Page ───

const CAREER_PATHS = {
  'Software Engineer': {
    timeline: [
      { year: 2025, role: 'Junior Software Engineer', salary: '₹6–10 LPA', skills: ['JavaScript', 'React', 'Git', 'REST APIs'] },
      { year: 2026, role: 'Software Engineer', salary: '₹10–16 LPA', skills: ['System Design', 'TypeScript', 'CI/CD', 'Testing'] },
      { year: 2027, role: 'Senior Software Engineer', salary: '₹16–25 LPA', skills: ['Architecture', 'Mentoring', 'Cloud (AWS/GCP)', 'Microservices'] },
      { year: 2028, role: 'Staff Engineer / Tech Lead', salary: '₹25–38 LPA', skills: ['Tech Strategy', 'Cross-team Leadership', 'Performance Optimization'] },
      { year: 2029, role: 'Principal Engineer', salary: '₹38–55 LPA', skills: ['Org-wide Architecture', 'Technical Vision', 'Innovation'] },
      { year: 2030, role: 'Distinguished Engineer / VP Eng', salary: '₹55–80+ LPA', skills: ['Industry Influence', 'Patent/Research', 'Executive Leadership'] }
    ],
    summary: { growthRate: '5–8× in 5 years', topSkill: 'System Architecture', demand: 'Very High' }
  },
  'Product Manager': {
    timeline: [
      { year: 2025, role: 'Associate Product Manager', salary: '₹8–14 LPA', skills: ['User Research', 'PRDs', 'Jira', 'Analytics'] },
      { year: 2026, role: 'Product Manager', salary: '₹14–22 LPA', skills: ['A/B Testing', 'Stakeholder Mgmt', 'SQL', 'Roadmapping'] },
      { year: 2027, role: 'Senior Product Manager', salary: '₹22–35 LPA', skills: ['Product Strategy', 'P&L Ownership', 'Cross-functional Leadership'] },
      { year: 2028, role: 'Group Product Manager', salary: '₹35–50 LPA', skills: ['Portfolio Strategy', 'Team Building', 'Market Expansion'] },
      { year: 2029, role: 'Director of Product', salary: '₹50–70 LPA', skills: ['Executive Communication', 'Revenue Growth', 'Platform Thinking'] },
      { year: 2030, role: 'VP of Product / CPO', salary: '₹70–1 Cr+', skills: ['Board Presentations', 'Company Strategy', 'Innovation Labs'] }
    ],
    summary: { growthRate: '6–9× in 5 years', topSkill: 'Product Strategy', demand: 'High' }
  },
  'Data Scientist': {
    timeline: [
      { year: 2025, role: 'Junior Data Scientist', salary: '₹6–12 LPA', skills: ['Python', 'Pandas', 'Statistics', 'SQL'] },
      { year: 2026, role: 'Data Scientist', salary: '₹12–20 LPA', skills: ['ML Models', 'Feature Engineering', 'TensorFlow/PyTorch', 'A/B Testing'] },
      { year: 2027, role: 'Senior Data Scientist', salary: '₹20–32 LPA', skills: ['Deep Learning', 'MLOps', 'Research Papers', 'Business Impact'] },
      { year: 2028, role: 'Lead Data Scientist', salary: '₹32–48 LPA', skills: ['AI Strategy', 'Team Leadership', 'GenAI/LLMs', 'Production ML'] },
      { year: 2029, role: 'Principal Data Scientist', salary: '₹48–65 LPA', skills: ['Org-wide AI Adoption', 'Innovation', 'Executive Advisory'] },
      { year: 2030, role: 'Head of AI / Chief Data Officer', salary: '₹65–1 Cr+', skills: ['AI Ethics', 'Industry Thought Leadership', 'Board-level Strategy'] }
    ],
    summary: { growthRate: '7–10× in 5 years', topSkill: 'Machine Learning', demand: 'Very High' }
  },
  'UX Designer': {
    timeline: [
      { year: 2025, role: 'UX Designer', salary: '₹5–10 LPA', skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'] },
      { year: 2026, role: 'Senior UX Designer', salary: '₹10–18 LPA', skills: ['Design Systems', 'Usability Testing', 'Interaction Design'] },
      { year: 2027, role: 'Lead UX Designer', salary: '₹18–28 LPA', skills: ['Design Strategy', 'Team Mentoring', 'Accessibility'] },
      { year: 2028, role: 'UX Manager', salary: '₹28–40 LPA', skills: ['Design Ops', 'Cross-functional Alignment', 'Business Metrics'] },
      { year: 2029, role: 'Director of Design', salary: '₹40–55 LPA', skills: ['Design Vision', 'Org Leadership', 'Innovation'] },
      { year: 2030, role: 'VP of Design / CDO', salary: '₹55–75+ LPA', skills: ['Brand Strategy', 'Executive Influence', 'Industry Awards'] }
    ],
    summary: { growthRate: '6–8× in 5 years', topSkill: 'Design Strategy', demand: 'High' }
  }
};

export function renderSimulator(container) {
  const roles = Object.keys(CAREER_PATHS);

  container.innerHTML = `
    <div class="page simulator-page">
      <!-- Header -->
      <div class="simulator-header">
        <span class="section-label">Career Simulator</span>
        <h1 class="section-title">Visualize Your Future</h1>
        <p class="section-subtitle mx-auto">
          See your projected career trajectory from 2025 to 2030 with realistic salary,
          role, and skill milestones for the Indian market.
        </p>
      </div>

      <!-- Role Selection -->
      <div class="sim-input-area">
        <div class="sim-input-row">
          <div class="sim-field">
            <label for="sim-role">Select Career Path</label>
            <select id="sim-role">
              ${roles.map(r => `<option value="${r}">${r}</option>`).join('')}
            </select>
          </div>
          <div class="sim-field">
            <label for="sim-exp">Current Experience</label>
            <select id="sim-exp">
              <option value="0-2">0–2 years (Entry Level)</option>
              <option value="2-5">2–5 years (Mid Level)</option>
              <option value="5-8">5–8 years (Senior)</option>
              <option value="8+">8+ years (Lead/Principal)</option>
            </select>
          </div>
          <button class="btn btn-primary" id="sim-generate-btn">Generate Timeline</button>
        </div>
      </div>

      <!-- Timeline -->
      <div id="sim-timeline-container"></div>

      <!-- Summary -->
      <div id="sim-summary-container"></div>
    </div>
  `;

  // Generate default timeline
  generateTimeline('Software Engineer');

  // Event handler
  document.getElementById('sim-generate-btn').addEventListener('click', () => {
    const role = document.getElementById('sim-role').value;
    generateTimeline(role);
  });
}

function generateTimeline(roleName) {
  const path = CAREER_PATHS[roleName];
  if (!path) return;

  const timelineContainer = document.getElementById('sim-timeline-container');
  const summaryContainer = document.getElementById('sim-summary-container');

  timelineContainer.innerHTML = `
    <div class="timeline">
      ${path.timeline.map((item, i) => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-role">${item.role}</div>
            <div class="timeline-salary">${item.salary}</div>
            <div class="timeline-skills">
              ${item.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  summaryContainer.innerHTML = `
    <div class="sim-summary">
      <div class="summary-card">
        <div class="summary-value">${path.summary.growthRate}</div>
        <div class="summary-label">Salary Growth Potential</div>
      </div>
      <div class="summary-card">
        <div class="summary-value">${path.summary.topSkill}</div>
        <div class="summary-label">Most Critical Skill</div>
      </div>
      <div class="summary-card">
        <div class="summary-value">${path.summary.demand}</div>
        <div class="summary-label">Market Demand (India)</div>
      </div>
    </div>
  `;
}
