const Joi = require('joi');

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().min(2).max(100).required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  analyzeFeedback: Joi.object({
    text: Joi.string().min(10).max(10000).required(),
    source: Joi.string().valid('product_review', 'survey', 'support_ticket', 'social_media', 'email', 'other'),
    metadata: Joi.object().unknown(true)
  }),
  batchAnalyze: Joi.object({
    feedbacks: Joi.array().items(
      Joi.object({
        text: Joi.string().min(10).max(10000).required(),
        source: Joi.string().valid('product_review', 'survey', 'support_ticket', 'social_media', 'email', 'other'),
        metadata: Joi.object().unknown(true)
      })
    ).min(1).max(50).required()
  })
};

function validate(schemaName) {
  return (req, res, next) => {
    const { error } = schemas[schemaName].validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(d => d.message);
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
    }
    next();
  };
}

module.exports = { validate };
