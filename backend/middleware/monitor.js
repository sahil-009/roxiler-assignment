const os = require('os');

// Monitor middleware
const monitor = (req, res, next) => {
    req.startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        const log = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent'),
            ip: req.ip
        };
        console.log('Request Log:', log);
    });
    next();
};

// System metrics endpoint
const getSystemMetrics = (req, res) => {
    const metrics = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        systemInfo: {
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            cpuCount: os.cpus().length,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            loadAvg: os.loadavg()
        },
        process: {
            pid: process.pid,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime()
        }
    };

    res.json({
        success: true,
        data: metrics
    });
};

module.exports = {
    monitor,
    getSystemMetrics
};