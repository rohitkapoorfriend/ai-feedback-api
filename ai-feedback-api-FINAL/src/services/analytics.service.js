const Feedback = require('../models/Feedback');

class AnalyticsService {
  async getSentimentSummary(userId) {
    const result = await Feedback.aggregate([
      { $match: { userId, status: 'completed' } },
      { $group: {
        _id: '$analysis.sentiment.overall',
        count: { $sum: 1 },
        avgScore: { $avg: '$analysis.sentiment.score' }
      }},
      { $sort: { count: -1 } }
    ]);

    const total = result.reduce((sum, r) => sum + r.count, 0);
    return {
      total,
      breakdown: result.map(r => ({
        sentiment: r._id,
        count: r.count,
        percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
        avgScore: Math.round(r.avgScore * 100) / 100
      }))
    };
  }

  async getTopKeywords(userId, limit = 20) {
    const result = await Feedback.aggregate([
      { $match: { userId, status: 'completed' } },
      { $unwind: '$analysis.keywords' },
      { $group: { _id: '$analysis.keywords', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    return result.map(r => ({ keyword: r._id, count: r.count }));
  }

  async getThemes(userId) {
    const result = await Feedback.aggregate([
      { $match: { userId, status: 'completed' } },
      { $unwind: '$analysis.themes' },
      { $group: { _id: '$analysis.themes', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return result.map(r => ({ theme: r._id, count: r.count }));
  }
}

module.exports = new AnalyticsService();
