const express = require('express');
const { auth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validator');
const feedbackService = require('../services/feedback.service');
const exportService = require('../services/export.service');
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

// Batch analyze (up to 50)
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

// Export feedbacks as CSV
router.get('/export', async (req, res, next) => {
  try {
    const { sentiment, source, startDate, endDate } = req.query;
    const { csv, count } = await exportService.exportCSV(req.user._id, { sentiment, source, startDate, endDate });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="feedback-export-${Date.now()}.csv"`);
    res.setHeader('X-Record-Count', count);
    res.send(csv);
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

// List feedbacks with pagination, filters, and date range
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sentiment, source, startDate, endDate } = req.query;
    const result = await feedbackService.list(req.user._id, {
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 20, 100),
      sentiment,
      source,
      startDate,
      endDate
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;