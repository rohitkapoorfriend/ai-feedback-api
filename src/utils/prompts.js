const ANALYZE_FEEDBACK_PROMPT = `You are an expert customer feedback analyst. Analyze the following feedback and return a JSON object with this exact structure:

{
  "summary": "2-3 sentence summary of the feedback",
  "sentiment": {
    "overall": "positive" | "negative" | "neutral" | "mixed",
    "score": 0.0 to 1.0 (0 = very negative, 1 = very positive),
    "breakdown": {
      "aspect_name": { "label": "positive|negative|neutral", "score": 0.0-1.0 }
    }
  },
  "keywords": ["keyword1", "keyword2", ...],
  "themes": ["theme1", "theme2", ...],
  "actionable_insights": ["insight1", "insight2"]
}

Rules:
- Extract 3-8 keywords that capture the main topics
- Identify 1-4 themes from: product_satisfaction, delivery_issues, support_experience, pricing, usability, feature_request, bug_report, general_praise, general_complaint
- Provide 1-3 actionable insights the business can act on
- Sentiment breakdown should cover each distinct aspect mentioned
- Return ONLY valid JSON, no markdown or explanation

Feedback to analyze:`;

const BATCH_ANALYZE_PROMPT = `You are an expert feedback analyst. Analyze each feedback below and return a JSON array. Each item should have the structure:
{
  "index": 0,
  "summary": "...",
  "sentiment": { "overall": "...", "score": 0.0-1.0 },
  "keywords": [...],
  "themes": [...]
}

Return ONLY valid JSON array. Feedbacks:`;

module.exports = { ANALYZE_FEEDBACK_PROMPT, BATCH_ANALYZE_PROMPT };
