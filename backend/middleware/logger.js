const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

// Custom token for response body
morgan.token('body', (req) => JSON.stringify(req.body));

// Custom logging format
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :body';

// Create logger middleware
const logger = morgan(logFormat, {
    stream: accessLogStream,
    skip: (req) => {
        // Don't log requests for static files or health checks
        return req.url.startsWith('/static') || req.url === '/health';
    }
});

module.exports = logger;