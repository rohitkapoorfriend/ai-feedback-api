const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalText: { type: String, required: true, maxlength: 10000 },
  source: { type: String, enum: ['product_review', 'survey', 'support_ticket', 'social_media', 'email', 'other'], default: 'other' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  analysis: {
    summary: { type: String },
    sentiment: {
      overall: { type: String, enum: ['positive', 'negative', 'neutral', 'mixed'] },
      score: { type: Number, min: 0, max: 1 },
      breakdown: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    keywords: [{ type: String }],
    themes: [{ type: String }],
    actionableInsights: [{ type: String }]
  },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  processingTimeMs: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

feedbackSchema.index({ 'analysis.sentiment.overall': 1 });
feedbackSchema.index({ 'analysis.keywords': 1 });
feedbackSchema.index({ 'analysis.themes': 1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
