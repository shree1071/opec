// ─── Landing Page ───

export function renderLanding(container) {
  container.innerHTML = `
    <div class="page landing-page">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-badge">◈ OPEC Methodology</div>
          <h1 class="hero-title">
            <em>Stop guessing</em><br>your future.
          </h1>
          <p class="hero-subtitle">
            Career Clarity uses the OPEC framework — Observation, Pattern, Evaluation, Clarity — 
            to guide you through AI-powered career discovery with precision and empathy.
          </p>
          <div class="hero-actions">
            <a href="#/chat" class="btn btn-primary btn-lg">Start Your Journey →</a>
            <a href="#/dashboard" class="btn btn-secondary btn-lg">Explore Dashboard</a>
          </div>
        </div>
      </section>

      <!-- OPEC Agents -->
      <section class="opec-section">
        <div class="container text-center">
          <span class="section-label">The Framework</span>
          <h2 class="section-title">Four Agents, One Clarity</h2>
          <p class="section-subtitle mx-auto">
            Each agent plays a unique role in uncovering your ideal career path,
            working together to transform confusion into clarity.
          </p>
          <div class="opec-grid">
            <div class="opec-card reveal" data-agent="O">
              <div class="opec-icon">O</div>
              <h3 class="opec-card-title">Observation</h3>
              <p class="opec-card-desc">
                Listens deeply to understand your current role, feelings, and hidden frustrations.
              </p>
            </div>
            <div class="opec-card reveal" data-agent="P">
              <div class="opec-icon">P</div>
              <h3 class="opec-card-title">Pattern</h3>
              <p class="opec-card-desc">
                Identifies recurring themes in your skills, interests, and past victories.
              </p>
            </div>
            <div class="opec-card reveal" data-agent="E">
              <div class="opec-icon">E</div>
              <h3 class="opec-card-title">Evaluation</h3>
              <p class="opec-card-desc">
                Matches your patterns against real market demand and career opportunities.
              </p>
            </div>
            <div class="opec-card reveal" data-agent="C">
              <div class="opec-icon">C</div>
              <h3 class="opec-card-title">Clarity</h3>
              <p class="opec-card-desc">
                Delivers a concrete, actionable 3-step plan to move forward with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features-section">
        <div class="container text-center">
          <span class="section-label">What You Get</span>
          <h2 class="section-title">Everything You Need</h2>
          <p class="section-subtitle mx-auto">
            Three powerful tools designed to give you complete career clarity.
          </p>
          <div class="features-grid">
            <div class="feature-card reveal" onclick="location.hash='#/chat'">
              <div class="feature-icon">💬</div>
              <h3 class="feature-title">OPEC Career Chat</h3>
              <p class="feature-desc">
                Guided AI conversation that walks you through all four OPEC agents, 
                uncovering your ideal career path step by step.
              </p>
              <span class="feature-link">Start chatting <span>→</span></span>
            </div>
            <div class="feature-card reveal" onclick="location.hash='#/interview'">
              <div class="feature-icon">🎥</div>
              <h3 class="feature-title">3D AI Interview</h3>
              <p class="feature-desc">
                Face-to-face video interview with an AI avatar that adapts to your
                responses and provides real-time career guidance.
              </p>
              <span class="feature-link">Try interview <span>→</span></span>
            </div>
            <div class="feature-card reveal" onclick="location.hash='#/simulator'">
              <div class="feature-icon">📈</div>
              <h3 class="feature-title">Career Simulator</h3>
              <p class="feature-desc">
                Visualize your career trajectory from 2025 to 2030 with projected
                salary growth, role progression, and skill milestones.
              </p>
              <span class="feature-link">Simulate path <span>→</span></span>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-box reveal">
          <span class="section-label">Ready?</span>
          <h2 class="section-title">Your Future Starts Now</h2>
          <p class="section-subtitle mx-auto" style="margin-bottom:2rem;">
            Join thousands who've found career clarity through the OPEC methodology.
            Your personalized AI career guide is waiting.
          </p>
          <a href="#/dashboard" class="btn btn-primary btn-lg">Enter Dashboard →</a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container">
          <p>© 2025 Career Clarity · Powered by the OPEC Methodology · Built with ♥</p>
        </div>
      </footer>
    </div>
  `;

  // Scroll reveal
  setTimeout(() => initScrollReveal(), 100);
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}
