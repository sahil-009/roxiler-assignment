const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Set to true to see SQL queries in console
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connection successful');
        
        // Ensure models are loaded before sync
        const User = require('../models/User');
        const Store = require('../models/Store');
        const Rating = require('../models/Rating');
        const Product = require('../models/Product');

        // Associations
        User.hasMany(Rating, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Rating.belongsTo(User, { foreignKey: 'userId' });

        Store.hasMany(Rating, { foreignKey: 'storeId', onDelete: 'CASCADE' });
        Rating.belongsTo(Store, { foreignKey: 'storeId' });

        User.hasOne(Store, { as: 'ownedStore', foreignKey: 'ownerId' });
        Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

        // Products
        Store.hasMany(Product, { foreignKey: 'storeId', onDelete: 'CASCADE' });
        Product.belongsTo(Store, { foreignKey: 'storeId' });

        // Sync models without altering existing tables to avoid index churn
        await sequelize.sync();
        console.log('Database & tables synced');
    } catch (error) {
        console.error('MySQL connection failed:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectToDB };