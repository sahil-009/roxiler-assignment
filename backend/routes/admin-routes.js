const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createUserSchema, createStoreSchema, updateStoreSchema } = require('../middleware/validation-schemas');
const {
    listUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getDashboard,
    listStores,
    createStore,
    getStore,
    updateStore,
    deleteStore
} = require('../controllers/admin-controller');

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/users', listUsers);
router.post('/users', async (req, res, next) => {
  try {
    req.body = await createUserSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.details.map(d => d.message) });
  }
}, createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Dashboard
router.get('/dashboard', getDashboard);

// Stores
router.get('/stores', listStores);
router.post('/stores', async (req, res, next) => {
  try {
    req.body = await createStoreSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.details.map(d => d.message) });
  }
}, createStore);
router.get('/stores/:id', getStore);
router.put('/stores/:id', async (req, res, next) => {
  try {
    req.body = await updateStoreSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.details.map(d => d.message) });
  }
}, updateStore);
router.delete('/stores/:id', deleteStore);

module.exports = router;



