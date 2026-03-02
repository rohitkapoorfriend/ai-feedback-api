const express = require('express');
const { auth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validator');
const feedbackService = require('../services/feedback.service');
const router = express.Router();

// All feedback routes require authentication
router.use(auth);
router.use(apiLimiter);

// Analyze single feedback
router.post('/analyze', validate('analyzeFeedback'), async (req, res, next) => {
  try {
    const result = await feedbackService.analyze(req.user._id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Batch analyze
router.post('/batch', validate('batchAnalyze'), async (req, res, next) => {
  try {
    const results = await feedbackService.batchAnalyze(req.user._id, req.body.feedbacks);
    const succeeded = results.filter(r => r.success).length;
    res.status(201).json({
      success: true,
      summary: { total: results.length, succeeded, failed: results.length - succeeded },
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Get single feedback
router.get('/:id', async (req, res, next) => {
  try {
    const feedback = await feedbackService.getById(req.user._id, req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
});

// List feedbacks with pagination and filters
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sentiment, source } = req.query;
    const result = await feedbackService.list(req.user._id, {
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 20, 100),
      sentiment,
      source
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
