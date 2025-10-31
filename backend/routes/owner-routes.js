const express = require('express');
const router = express.Router();
const { getOwnerDashboard, getMyStore, createMyStore, listProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/owner-controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('owner'));

router.get('/dashboard', getOwnerDashboard);
router.get('/store', getMyStore);
router.post('/store', createMyStore);
router.get('/products', listProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;





