// ─── Career Clarity Configuration ───
const CONFIG = {
  // Gemini API
  GEMINI_API_KEY: 'AIzaSyBwhJTcJflTN4IVix0pZKEaiPDuEnva3cg',
  GEMINI_MODEL: 'gemini-3-flash-preview',
  GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models',

  // Tavus API
  TAVUS_API_KEY: '196d26fb4ff44e33b4f9ffce62d19db1',
  TAVUS_ENDPOINT: 'https://tavusapi.com/v2/conversations',

  // App
  APP_NAME: 'Career Clarity',
  APP_TAGLINE: 'Stop guessing your future',
  VERSION: '1.0.0',

  // OPEC Agents
  AGENTS: {
    O: { name: 'Observer', color: '#D4A574', icon: 'opec-o' },
    P: { name: 'Pattern', color: '#8B6F5E', icon: 'opec-p' },
    E: { name: 'Evaluator', color: '#6B8F71', icon: 'opec-e' },
    C: { name: 'Clarity', color: '#4A6FA5', icon: 'opec-c' }
  }
};

export default CONFIG;
