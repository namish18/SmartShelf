const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        // MongoDB connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
        };

        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);

        // Connection event handlers
        mongoose.connection.on('connected', () => {
            console.log('📊 Mongoose connected to MongoDB'.green);
        });

        mongoose.connection.on('error', (err) => {
            console.error(`❌ Mongoose connection error: ${err}`.red);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  Mongoose disconnected from MongoDB'.yellow);
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔌 MongoDB connection closed through app termination'.red);
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error(`❌ Database connection error: ${error.message}`.red.bold);
        
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// Database health check function
const checkDatabaseHealth = async () => {
    try {
        const state = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        return {
            status: states[state],
            host: mongoose.connection.host,
            database: mongoose.connection.name,
            collections: await mongoose.connection.db.listCollections().toArray()
        };
    } catch (error) {
        return {
            status: 'error',
            error: error.message
        };
    }
};

// Create indexes for better performance
const createIndexes = async () => {
    try {
        // Inventory collection indexes
        await mongoose.connection.db.collection('inventories').createIndex({ 
            'expiryDate': 1,
            'warehouseId': 1 
        });
        
        await mongoose.connection.db.collection('inventories').createIndex({ 
            'productId': 1,
            'batchNumber': 1 
        });
        
        // Product collection indexes
        await mongoose.connection.db.collection('products').createIndex({ 
            'sku': 1 
        }, { unique: true });
        
        await mongoose.connection.db.collection('products').createIndex({ 
            'category': 1,
            'isPerishable': 1 
        });
        
        // Alert collection indexes
        await mongoose.connection.db.collection('alerts').createIndex({ 
            'type': 1,
            'status': 1,
            'createdAt': -1 
        });
        
        // Transaction collection indexes
        await mongoose.connection.db.collection('transactions').createIndex({ 
            'type': 1,
            'createdAt': -1 
        });
        
        console.log('📋 Database indexes created successfully'.green);
    } catch (error) {
        console.error(`❌ Error creating indexes: ${error.message}`.red);
    }
};

module.exports = {
    connectDB,
    checkDatabaseHealth,
    createIndexes
};
