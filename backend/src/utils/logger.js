const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Get current date for log file naming
const getLogFileName = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
};

// Format log message
const formatLogMessage = (level, message, meta = null) => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}\n`;
};

// Write to log file
const writeToFile = (level, message, meta = null) => {
  const logFile = path.join(logsDir, getLogFileName());
  const logMessage = formatLogMessage(level, message, meta);
  
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// Logger object
const logger = {
  info: (message, meta = null) => {
    console.log(`ℹ️  ${message}`, meta || '');
    writeToFile('info', message, meta);
  },

  error: (message, meta = null) => {
    console.error(`❌ ${message}`, meta || '');
    writeToFile('error', message, meta);
  },

  warn: (message, meta = null) => {
    console.warn(`⚠️  ${message}`, meta || '');
    writeToFile('warn', message, meta);
  },

  debug: (message, meta = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🐛 ${message}`, meta || '');
      writeToFile('debug', message, meta);
    }
  },

  success: (message, meta = null) => {
    console.log(`✅ ${message}`, meta || '');
    writeToFile('success', message, meta);
  }
};

module.exports = logger;
