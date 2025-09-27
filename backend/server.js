const app = require('./app');
const connectDB = require('./config/database');
const connectRedis = require('./config/redis');
require('dotenv').config();

// Import scheduled jobs
const { startExpiryCheckJob } = require('./jobs/expiryCheckJob');
const { startAlertJob } = require('./jobs/alertJob');
const { startReportGenerationJob } = require('./jobs/reportGenerationJob');

// Set port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Connect to MongoDB
connectDB();

// Connect to Redis (for caching and session management)
connectRedis();

// Start the server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📊 AI Inventory Management System is live!`);
    
    // Start scheduled jobs after server initialization
    startExpiryCheckJob();
    startAlertJob();
    startReportGenerationJob();
    
    console.log('⏰ Background jobs initialized');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
        process.exit(0);
    });
});

module.exports = server;
