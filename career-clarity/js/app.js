// ─── Career Clarity App — Main Entry Point ───
import Router from './utils/router.js';
import { renderLanding } from './pages/landing.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderChat } from './pages/chat.js';
import { renderInterview } from './pages/interview.js';
import { renderSimulator } from './pages/simulator.js';

// ─── Initialize Router ───
const router = new Router();

router
  .register('/', renderLanding)
  .register('/dashboard', renderDashboard)
  .register('/chat', renderChat)
  .register('/interview', renderInterview)
  .register('/simulator', renderSimulator);

// ─── Mobile Nav Toggle ───
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  }
});

// ─── Navbar Scroll Effect ───
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  navbar.classList.toggle('scrolled', currentScroll > 20);
  lastScroll = currentScroll;
}, { passive: true });

// ─── Close Mobile Nav on Route Change ───
router.onNavigate = () => {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
};

// ─── Start App ───
router.start();

console.log(
  '%c◈ Career Clarity %cv1.0 %c— OPEC Methodology',
  'color:#C4915E;font-size:16px;font-weight:bold;',
  'color:#8B7355;font-size:12px;',
  'color:#6B8F71;font-size:12px;'
);
