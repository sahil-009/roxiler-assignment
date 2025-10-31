const helmet = require('helmet');

// CSRF removed per requirements

// Security middleware configuration
const securityMiddleware = (app) => {
    // Cookie parser not required

    // Set security headers using helmet
    app.use(helmet());

    // XSS-clean removed (incompatible with Express 5 query getters)


    // Additional security headers
    app.use((req, res, next) => {
        // Set strict transport security
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        
        // Prevent clickjacking
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        
        // Disable client-side caching
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        // Enable Cross-Origin Resource Sharing headers
        const requestOrigin = req.headers.origin;
        const configured = process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173';
        const allowedOrigins = configured.split(',').map(o => o.trim()).filter(Boolean);
        const allowOrigin = requestOrigin && allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];
        if (allowOrigin) res.setHeader('Access-Control-Allow-Origin', allowOrigin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        next();
    });

// CSRF disabled

    // Pass-through error handler hook
    app.use((err, req, res, next) => next(err));

    return app;
};

module.exports = securityMiddleware;