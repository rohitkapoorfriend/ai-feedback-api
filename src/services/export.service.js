const Feedback = require('../models/Feedback');

class ExportService {
  /**
   * Export feedback records as CSV string
   */
  async exportCSV(userId, { sentiment, source, startDate, endDate } = {}) {
    const query = { userId, status: 'completed' };
    if (sentiment) query['analysis.sentiment.overall'] = sentiment;
    if (source) query.source = source;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 }).limit(10000).lean();

    const headers = [
      'ID', 'Source', 'Sentiment', 'Score', 'Summary',
      'Keywords', 'Themes', 'Actionable Insights',
      'Processing Time (ms)', 'Created At', 'Original Text'
    ];

    const rows = feedbacks.map(f => [
      f._id.toString(),
      f.source || '',
      f.analysis?.sentiment?.overall || '',
      f.analysis?.sentiment?.score?.toFixed(2) || '',
      `"${(f.analysis?.summary || '').replace(/"/g, '""')}"`,
      `"${(f.analysis?.keywords || []).join(', ')}"`,
      `"${(f.analysis?.themes || []).join(', ')}"`,
      `"${(f.analysis?.actionableInsights || []).join(' | ').replace(/"/g, '""')}"`,
      f.processingTimeMs || '',
      f.createdAt ? new Date(f.createdAt).toISOString() : '',
      `"${(f.originalText || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return { csv, count: feedbacks.length };
  }
}

module.exports = new ExportService();