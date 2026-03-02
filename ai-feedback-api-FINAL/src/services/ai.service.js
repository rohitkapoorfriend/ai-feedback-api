const { getOpenAIClient } = require('../config/openai');
const { ANALYZE_FEEDBACK_PROMPT } = require('../utils/prompts');
const logger = require('../utils/logger');

class AIService {
  /**
   * Analyze a single feedback text using OpenAI or mock mode
   */
  async analyzeFeedback(text) {
    if (process.env.MOCK_AI === 'true') {
      return this._mockAnalysis(text);
    }
    return this._openAIAnalysis(text);
  }

  /**
   * Real OpenAI GPT analysis
   */
  async _openAIAnalysis(text) {
    const client = getOpenAIClient();
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are a customer feedback analyst. Always respond with valid JSON only.' },
          { role: 'user', content: `${ANALYZE_FEEDBACK_PROMPT}\n\n"${text}"` }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      const analysis = JSON.parse(content);

      logger.debug('OpenAI analysis completed', { model, tokens: response.usage?.total_tokens });
      return this._normalizeAnalysis(analysis);
    } catch (error) {
      logger.error('OpenAI API error:', error.message);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Mock analysis for testing without OpenAI key
   */
  _mockAnalysis(text) {
    const words = text.toLowerCase().split(/\s+/);
    const positiveWords = ['amazing', 'great', 'love', 'excellent', 'good', 'best', 'helpful', 'fantastic', 'perfect', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'worst', 'slow', 'broken', 'disappointed', 'awful', 'poor', 'frustrating', 'hate'];

    const posCount = words.filter(w => positiveWords.includes(w)).length;
    const negCount = words.filter(w => negativeWords.includes(w)).length;

    let overall = 'neutral';
    let score = 0.5;
    if (posCount > negCount) { overall = 'positive'; score = Math.min(0.95, 0.6 + posCount * 0.1); }
    else if (negCount > posCount) { overall = 'negative'; score = Math.max(0.05, 0.4 - negCount * 0.1); }
    if (posCount > 0 && negCount > 0) { overall = 'mixed'; score = 0.5; }

    // Extract meaningful words as keywords
    const stopWords = new Set(['the', 'a', 'an', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'it', 'this', 'that', 'but', 'and', 'or', 'not', 'so', 'very', 'just', 'about', 'up', 'out', 'if', 'my', 'i', 'we', 'they', 'you', 'he', 'she', 'when', 'how', 'what', 'which', 'who', 'where', 'why', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'also']);
    const keywords = [...new Set(words.filter(w => w.length > 3 && !stopWords.has(w)))].slice(0, 6);

    const themes = [];
    if (text.match(/product|quality|item|material/i)) themes.push('product_satisfaction');
    if (text.match(/ship|deliver|arrive|late|slow/i)) themes.push('delivery_issues');
    if (text.match(/support|help|service|agent|team/i)) themes.push('support_experience');
    if (text.match(/price|cost|expensive|cheap|value/i)) themes.push('pricing');
    if (text.match(/easy|hard|confus|intuit|interface/i)) themes.push('usability');
    if (themes.length === 0) themes.push('general_praise');

    return {
      summary: `Feedback expresses ${overall} sentiment. ${text.substring(0, 100)}...`,
      sentiment: { overall, score, breakdown: {} },
      keywords,
      themes,
      actionableInsights: [`Address ${overall} feedback patterns to improve customer satisfaction.`]
    };
  }

  /**
   * Normalize AI response to ensure consistent structure
   */
  _normalizeAnalysis(raw) {
    return {
      summary: raw.summary || 'No summary available',
      sentiment: {
        overall: raw.sentiment?.overall || 'neutral',
        score: typeof raw.sentiment?.score === 'number' ? raw.sentiment.score : 0.5,
        breakdown: raw.sentiment?.breakdown || {}
      },
      keywords: Array.isArray(raw.keywords) ? raw.keywords.slice(0, 8) : [],
      themes: Array.isArray(raw.themes) ? raw.themes.slice(0, 4) : [],
      actionableInsights: Array.isArray(raw.actionable_insights || raw.actionableInsights)
        ? (raw.actionable_insights || raw.actionableInsights).slice(0, 3)
        : []
    };
  }
}

module.exports = new AIService();
