const redis = require('redis');
const colors = require('colors');

let redisClient = null;

const connectRedis = async () => {
    try {
        // Redis configuration
        const redisConfig = {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            db: process.env.REDIS_DB || 0,
            retryDelayOnFailover: 100,
            enableReadyCheck: true,
            maxRetriesPerRequest: null,
            retryDelayOnClusterDown: 300,
            retryDelayOnFailover: 100,
            maxRetriesPerRequest: 3,
        };

        // Create Redis client
        redisClient = redis.createClient({
            socket: {
                host: redisConfig.host,
                port: redisConfig.port,
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        return new Error('Too many retries on Redis connection');
                    }
                    return Math.min(retries * 50, 500);
                }
            },
            password: redisConfig.password,
            database: redisConfig.db
        });

        // Event listeners
        redisClient.on('connect', () => {
            console.log('🔗 Redis client connected'.cyan);
        });

        redisClient.on('ready', () => {
            console.log('✅ Redis client ready to use'.green);
        });

        redisClient.on('error', (err) => {
            console.error(`❌ Redis client error: ${err.message}`.red);
        });

        redisClient.on('end', () => {
            console.log('⚠️  Redis client connection closed'.yellow);
        });

        // Connect to Redis
        await redisClient.connect();
        
        console.log(`✅ Redis Connected: ${redisConfig.host}:${redisConfig.port}`.cyan.underline);

        return redisClient;
    } catch (error) {
        console.error(`❌ Redis connection error: ${error.message}`.red.bold);
        
        // Continue without Redis if connection fails
        console.log('⚠️  Continuing without Redis cache...'.yellow);
        return null;
    }
};

// Redis utility functions
const redisUtils = {
    // Set key with expiration
    setWithExpiry: async (key, value, expiryInSeconds = 3600) => {
        if (!redisClient || !redisClient.isReady) return false;
        
        try {
            await redisClient.setEx(key, expiryInSeconds, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Redis SET error: ${error.message}`);
            return false;
        }
    },

    // Get value by key
    get: async (key) => {
        if (!redisClient || !redisClient.isReady) return null;
        
        try {
            const value = await redisClient.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Redis GET error: ${error.message}`);
            return null;
        }
    },

    // Delete key
    del: async (key) => {
        if (!redisClient || !redisClient.isReady) return false;
        
        try {
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error(`Redis DEL error: ${error.message}`);
            return false;
        }
    },

    // Check if key exists
    exists: async (key) => {
        if (!redisClient || !redisClient.isReady) return false;
        
        try {
            const result = await redisClient.exists(key);
            return result === 1;
        } catch (error) {
            console.error(`Redis EXISTS error: ${error.message}`);
            return false;
        }
    },

    // Set hash field
    hSet: async (key, field, value) => {
        if (!redisClient || !redisClient.isReady) return false;
        
        try {
            await redisClient.hSet(key, field, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Redis HSET error: ${error.message}`);
            return false;
        }
    },

    // Get hash field
    hGet: async (key, field) => {
        if (!redisClient || !redisClient.isReady) return null;
        
        try {
            const value = await redisClient.hGet(key, field);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Redis HGET error: ${error.message}`);
            return null;
        }
    },

    // Clear all cache
    flushAll: async () => {
        if (!redisClient || !redisClient.isReady) return false;
        
        try {
            await redisClient.flushAll();
            return true;
        } catch (error) {
            console.error(`Redis FLUSHALL error: ${error.message}`);
            return false;
        }
    }
};

// Redis health check
const checkRedisHealth = async () => {
    try {
        if (!redisClient || !redisClient.isReady) {
            return {
                status: 'disconnected',
                message: 'Redis client not connected'
            };
        }

        await redisClient.ping();
        return {
            status: 'connected',
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            database: process.env.REDIS_DB || 0
        };
    } catch (error) {
        return {
            status: 'error',
            error: error.message
        };
    }
};

// Graceful shutdown
const closeRedisConnection = async () => {
    if (redisClient && redisClient.isReady) {
        await redisClient.quit();
        console.log('🔌 Redis connection closed'.red);
    }
};

module.exports = {
    connectRedis,
    redisClient: () => redisClient,
    redisUtils,
    checkRedisHealth,
    closeRedisConnection
};
