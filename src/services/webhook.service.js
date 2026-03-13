const logger = require('../utils/logger');

class WebhookService {
  /**
   * Send analysis result to configured webhook URL
   */
  async send(feedback) {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) return;

    const payload = {
      event: 'feedback.analyzed',
      timestamp: new Date().toISOString(),
      data: {
        id: feedback._id,
        source: feedback.source,
        sentiment: feedback.analysis?.sentiment?.overall,
        score: feedback.analysis?.sentiment?.score,
        themes: feedback.analysis?.themes,
        keywords: feedback.analysis?.keywords,
        processingTimeMs: feedback.processingTimeMs
      }
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Source': 'ai-feedback-analyzer' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        logger.warn(`Webhook delivery failed: HTTP ${response.status}`, { url: webhookUrl });
      } else {
        logger.debug('Webhook delivered successfully', { url: webhookUrl });
      }
    } catch (error) {
      // Webhook failures are non-fatal — log and continue
      logger.warn('Webhook delivery error (non-fatal):', error.message);
    }
  }
}

module.exports = new WebhookService();