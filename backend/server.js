require('dotenv').config();
const express = require('express');
const { monitor } = require('./middleware/monitor');
const securityMiddleware = require('./middleware/security');
const { generalLimiter } = require('./middleware/rateLimiter');
const { sequelize, connectToDB } = require('./db/db.js');
const authRoutes = require('./routes/auth-routes.js');
const monitorRoutes = require('./routes/monitor-routes.js');
const adminRoutes = require('./routes/admin-routes.js');
const storeRoutes = require('./routes/store-routes.js');
const ratingRoutes = require('./routes/rating-routes.js');
const ownerRoutes = require('./routes/owner-routes.js');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middleware (sets CORS headers)
securityMiddleware(app);

// Accept CORS preflight requests globally (Express 5 fix)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Security, monitoring, rate limiting
app.use(monitor);
app.use(generalLimiter);

// Connect to database
connectToDB();
app.set('sequelize', sequelize);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});