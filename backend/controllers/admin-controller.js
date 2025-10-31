const { Op, fn, col, literal } = require('sequelize');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

// GET /api/admin/users
exports.listUsers = async (req, res) => {
    try {
        const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
        const where = {};
        if (name) where.name = { [Op.like]: `%${name}%` };
        if (email) where.email = { [Op.like]: `%${email}%` };
        if (address) where.address = { [Op.like]: `%${address}%` };
        if (role) where.role = role;

        // Default: list all users, but frontend can pass ?role=user or ?role=admin
        const users = await User.findAll({
            where,
            attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt', 'updatedAt'],
            order: [[sortBy, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']]
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

// POST /api/admin/users
exports.createUser = async (req, res) => {
    try {
        const { name, email, address, password, role } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
        const user = await User.create({ name, email, address, password, role: role || 'user' });
        res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
};

// GET /api/admin/users/:id
exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt', 'updatedAt'] });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // If user is store owner, include their store's average rating
        let ownerInfo = null;
        if (user.role === 'owner') {
            const store = await Store.findOne({ where: { ownerId: user.id } });
            if (store) {
                const avgRow = await Rating.findOne({
                  where: { storeId: store.id },
                  attributes: [[fn('COALESCE', fn('AVG', col('rating')), 0), 'averageRating']]
                });
                ownerInfo = {
                  storeId: store.id,
                  storeName: store.name,
                  averageRating: Number(avgRow?.get('averageRating') || 0)
                };
            }
        }
        res.json({ success: true, data: { ...user.toJSON(), ...(ownerInfo ? { ownerInfo } : {}) } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user' });
    }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        const updated = await user.update(req.body);
        res.json({ success: true, data: { id: updated.id, name: updated.name, email: updated.email, address: updated.address, role: updated.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        await user.destroy();
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();
        res.json({ success: true, data: { totalUsers, totalStores, totalRatings } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
    }
};

// GET /api/admin/stores
exports.listStores = async (req, res) => {
    try {
        const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
        const where = {};
        if (name) where.name = { [Op.like]: `%${name}%` };
        if (email) where.email = { [Op.like]: `%${email}%` };
        if (address) where.address = { [Op.like]: `%${address}%` };

        const stores = await Store.findAll({
            where,
            attributes: {
                include: [
                    [fn('COALESCE', fn('AVG', col('Ratings.rating')), 0), 'averageRating'],
                    [fn('COUNT', col('Ratings.id')), 'ratingsCount']
                ]
            },
            include: [
                { model: Rating, attributes: [] },
                { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
            ],
            group: ['Store.id'],
            order: [[sortBy, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']]
        });

        res.json({ success: true, data: stores });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching stores' });
    }
};

// POST /api/admin/stores
exports.createStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;
        const store = await Store.create({ name, email, address, ownerId });
        res.status(201).json({ success: true, data: store });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating store' });
    }
};

// GET /api/admin/stores/:id
exports.getStore = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
            ]
        });
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
        res.json({ success: true, data: store });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching store' });
    }
};

// PUT /api/admin/stores/:id
exports.updateStore = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
        const updated = await store.update(req.body);
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating store' });
    }
};

// DELETE /api/admin/stores/:id
exports.deleteStore = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
        await store.destroy();
        res.json({ success: true, message: 'Store deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting store' });
    }
};