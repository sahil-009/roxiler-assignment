const express=require('express');
const router=express.Router();
const { register, login, getMe, updateMe, updatePassword, logout } = require('../controllers/auth-controller');
const { validateToken } = require('../middleware/auth');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema, updatePasswordSchema } = require('../middleware/validation-schemas');
const Joi = require('joi');

// Route for user registration
router.post('/register', registerLimiter, async (req, res, next) => {
  try {
    req.body = await registerSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.details.map(d => d.message) });
  }
}, register);

// Route for user login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    req.body = await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.details.map(d => d.message) });
  }
}, login);

// CSRF removed

// Get current user profile
router.get('/me', validateToken, getMe);

// Update current user profile
router.put('/me', validateToken, updateMe);

// Update password
router.put('/password', validateToken, async (req, res, next) => {
  try {
    req.body = await updatePasswordSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.details.map(d => d.message) });
  }
}, updatePassword);

// Logout
router.post('/logout', validateToken, logout);


module.exports=router;