const { Op, fn, col, literal } = require('sequelize');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

// GET /api/stores
exports.listStoresPublic = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
        const where = {};
        if (name) where.name = { [Op.like]: `%${name}%` };
        if (address) where.address = { [Op.like]: `%${address}%` };

        const stores = await Store.findAll({
            where,
            attributes: {
                include: [
                    [fn('COALESCE', fn('AVG', col('Ratings.rating')), 0), 'averageRating'],
                    // Current user's rating via subquery
                    [literal(userId ? `(
                        SELECT r.rating FROM Ratings r
                        WHERE r.storeId = Store.id AND r.userId = ${userId}
                        LIMIT 1
                    )` : 'NULL'), 'userRating']
                ]
            },
            include: [
                { model: Rating, attributes: [] }
            ],
            group: ['Store.id'],
            order: [[sortBy, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']]
        });

        res.json({ success: true, data: stores });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching stores' });
    }
};





