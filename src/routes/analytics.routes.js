const express = require('express');
const { auth } = require('../middleware/auth');
const analyticsService = require('../services/analytics.service');
const router = express.Router();

router.use(auth);

router.get('/summary', async (req, res, next) => {
  try {
    const data = await analyticsService.getSentimentSummary(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/keywords', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const data = await analyticsService.getTopKeywords(req.user._id, limit);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/themes', async (req, res, next) => {
  try {
    const data = await analyticsService.getThemes(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
