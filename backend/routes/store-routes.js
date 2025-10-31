const express = require('express');
const router = express.Router();
const { listStoresPublic } = require('../controllers/store-controller');
const { validateToken } = require('../middleware/auth');

// List/search stores for authenticated users
router.get('/', validateToken, listStoresPublic);

module.exports = router;





