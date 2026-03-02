const Feedback = require('../models/Feedback');
const aiService = require('./ai.service');
const logger = require('../utils/logger');

class FeedbackService {
  async analyze(userId, { text, source, metadata }) {
    const startTime = Date.now();

    const feedback = new Feedback({
      userId,
      originalText: text,
      source: source || 'other',
      metadata: metadata || {},
      status: 'pending'
    });

    try {
      const analysis = await aiService.analyzeFeedback(text);
      feedback.analysis = {
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        keywords: analysis.keywords,
        themes: analysis.themes,
        actionableInsights: analysis.actionableInsights
      };
      feedback.status = 'completed';
      feedback.processingTimeMs = Date.now() - startTime;

      await feedback.save();
      logger.info(`Feedback analyzed in ${feedback.processingTimeMs}ms`, { id: feedback._id });
      return feedback;
    } catch (error) {
      feedback.status = 'failed';
      await feedback.save();
      throw error;
    }
  }

  async batchAnalyze(userId, feedbacks) {
    const results = [];
    for (const item of feedbacks) {
      try {
        const result = await this.analyze(userId, item);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message, text: item.text.substring(0, 50) });
      }
    }
    return results;
  }

  async getById(userId, feedbackId) {
    return Feedback.findOne({ _id: feedbackId, userId });
  }

  async list(userId, { page = 1, limit = 20, sentiment, source } = {}) {
    const query = { userId };
    if (sentiment) query['analysis.sentiment.overall'] = sentiment;
    if (source) query.source = source;

    const skip = (page - 1) * limit;
    const [feedbacks, total] = await Promise.all([
      Feedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Feedback.countDocuments(query)
    ]);

    return {
      feedbacks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }
}

module.exports = new FeedbackService();
