const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getSystemMetrics } = require('../middleware/monitor');

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// System metrics route (protected, admin only)
router.get('/metrics', protect, authorize('admin', 'owner'), getSystemMetrics);

// Database health check
router.get('/db-health', protect, authorize('admin', 'owner'), async (req, res) => {
    try {
        await req.app.get('sequelize').authenticate();
        res.json({
            success: true,
            message: 'Database connection is healthy',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection error',
            error: error.message
        });
    }
});

module.exports = router;