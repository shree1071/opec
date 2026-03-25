// ─── Gemini API Client ───
import { GoogleGenAI } from '@google/genai';
import CONFIG from '../../config.js';
import Storage from '../utils/storage.js';
import { getSystemPrompt, getCurrentAgent } from '../utils/opec.js';

class GeminiAPI {
  static getApiKey() {
    return Storage.getApiKey('gemini') || CONFIG.GEMINI_API_KEY;
  }

  static async sendMessage(userMessage, chatHistory = []) {
    const apiKey = GeminiAPI.getApiKey();

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('GEMINI_KEY_MISSING');
    }

    const currentAgent = getCurrentAgent(chatHistory);
    const systemPrompt = getSystemPrompt(currentAgent, chatHistory);

    const ai = new GoogleGenAI({ apiKey });

    // Format interaction history into a text prompt suitable for content generation
    // We combine the system prompt, chat history, and the new user message
    let promptText = `System: ${systemPrompt}\n\n`;

    chatHistory.forEach(msg => {
      const roleName = msg.role === 'user' ? 'User' : 'Assistant';
      promptText += `${roleName}: ${msg.content}\n\n`;
    });

    promptText += `User: ${userMessage}\nAssistant:`;

    try {
      const response = await ai.models.generateContent({
        model: CONFIG.GEMINI_MODEL,
        contents: promptText,
        config: {
          temperature: 0.8,
          topP: 0.9,
          maxOutputTokens: 512
        }
      });

      if (!response.text) throw new Error('No response from Gemini');

      return { text: response.text, agent: currentAgent };
    } catch (err) {
      throw new Error(err.message || 'API error');
    }
  }
}

export default GeminiAPI;
