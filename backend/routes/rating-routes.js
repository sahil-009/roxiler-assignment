const express = require('express');
const router = express.Router();
const { submitOrUpdateRating } = require('../controllers/rating-controller');
const { validateToken } = require('../middleware/auth');
const { ratingSchema } = require('../middleware/validation-schemas');

// Submit or update rating for a store
router.post('/:storeId', validateToken, async (req, res, next) => {
  try {
    req.body = await ratingSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.details.map(d => d.message) });
  }
}, submitOrUpdateRating);

module.exports = router;


