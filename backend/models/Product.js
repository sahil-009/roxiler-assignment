const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: { len: [2, 60] }
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate: { min: 0 }
    },
    description: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
    storeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Product;


