const { fn, col } = require('sequelize');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');
const Product = require('../models/Product');

// GET /api/owner/dashboard
exports.getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const store = await Store.findOne({ where: { ownerId } });
        if (!store) {
            return res.json({ success: true, data: { store: null, averageRating: 0, raters: [] } });
        }

        const ratings = await Rating.findAll({
            where: { storeId: store.id },
            include: [{ model: User, attributes: ['id', 'name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });

        const avgRow = await Rating.findOne({
            where: { storeId: store.id },
            attributes: [[fn('COALESCE', fn('AVG', col('rating')), 0), 'averageRating']]
        });

        res.json({
            success: true,
            data: {
                store: { id: store.id, name: store.name },
                averageRating: Number(avgRow?.get('averageRating') || 0),
                raters: ratings.map(r => ({
                    id: r.id,
                    rating: r.rating,
                    user: r.User ? { id: r.User.id, name: r.User.name, email: r.User.email } : null
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching owner dashboard' });
    }
};

// GET /api/owner/store
exports.getMyStore = async (req, res) => {
    try{
        const store = await Store.findOne({ where: { ownerId: req.user.id } });
        res.json({ success: true, data: store });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error fetching store' });
    }
};

// POST /api/owner/store
exports.createMyStore = async (req, res) => {
    try{
        const existing = await Store.findOne({ where: { ownerId: req.user.id } });
        if (existing) return res.status(400).json({ success: false, message: 'Store already exists' });
        const { name, email, address } = req.body;
        const store = await Store.create({ name, email, address, ownerId: req.user.id });
        res.status(201).json({ success: true, data: store });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error creating store' });
    }
};

// PRODUCTS
// GET /api/owner/products
exports.listProducts = async (req, res) => {
    try{
        const store = await Store.findOne({ where: { ownerId: req.user.id } });
        if (!store) return res.status(400).json({ success: false, message: 'Create a store first' });
        const products = await Product.findAll({ where: { storeId: store.id }, order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: products });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error fetching products' });
    }
};

// POST /api/owner/products
exports.createProduct = async (req, res) => {
    try{
        const store = await Store.findOne({ where: { ownerId: req.user.id } });
        if (!store) return res.status(400).json({ success: false, message: 'Create a store first' });
        const { name, price, description } = req.body;
        const product = await Product.create({ name, price, description, storeId: store.id });
        res.status(201).json({ success: true, data: product });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error creating product' });
    }
};

// PUT /api/owner/products/:id
exports.updateProduct = async (req, res) => {
    try{
        const store = await Store.findOne({ where: { ownerId: req.user.id } });
        if (!store) return res.status(400).json({ success: false, message: 'Create a store first' });
        const product = await Product.findOne({ where: { id: req.params.id, storeId: store.id } });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        const updated = await product.update(req.body);
        res.json({ success: true, data: updated });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error updating product' });
    }
};

// DELETE /api/owner/products/:id
exports.deleteProduct = async (req, res) => {
    try{
        const store = await Store.findOne({ where: { ownerId: req.user.id } });
        if (!store) return res.status(400).json({ success: false, message: 'Create a store first' });
        const product = await Product.findOne({ where: { id: req.params.id, storeId: store.id } });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        await product.destroy();
        res.json({ success: true, message: 'Product deleted' });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
};





