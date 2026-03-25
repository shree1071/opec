// ─── LocalStorage User State ───

const STORAGE_KEY = 'career_clarity_state';

const defaultState = {
  userName: '',
  geminiApiKey: '',
  tavusApiKey: '',
  chatHistory: [],
  currentAgent: 'O',
  simulatorRole: '',
  simulatorExperience: '0-2',
  onboardingComplete: false,
  createdAt: null
};

class Storage {
  static get() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? { ...defaultState, ...JSON.parse(data) } : { ...defaultState };
    } catch {
      return { ...defaultState };
    }
  }

  static set(updates) {
    const current = Storage.get();
    const updated = { ...current, ...updates };
    if (!updated.createdAt) updated.createdAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  static getApiKey(service) {
    const state = Storage.get();
    if (service === 'gemini') return state.geminiApiKey;
    if (service === 'tavus') return state.tavusApiKey;
    return '';
  }

  static setApiKey(service, key) {
    if (service === 'gemini') Storage.set({ geminiApiKey: key });
    if (service === 'tavus') Storage.set({ tavusApiKey: key });
  }

  static getChatHistory() {
    return Storage.get().chatHistory || [];
  }

  static addChatMessage(role, content, agent = null) {
    const history = Storage.getChatHistory();
    history.push({ role, content, agent, timestamp: Date.now() });
    Storage.set({ chatHistory: history });
    return history;
  }

  static clearChat() {
    Storage.set({ chatHistory: [], currentAgent: 'O' });
  }

  static clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export default Storage;
