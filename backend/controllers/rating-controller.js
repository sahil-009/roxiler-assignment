const Rating = require('../models/Rating');
const Store = require('../models/Store');

// POST /api/ratings/:storeId
exports.submitOrUpdateRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storeId } = req.params;
        const { rating } = req.body;

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5' });
        }

        const store = await Store.findByPk(storeId);
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

        const [record, created] = await Rating.findOrCreate({
            where: { userId, storeId },
            defaults: { rating }
        });

        if (!created) {
            await record.update({ rating });
        }

        res.status(created ? 201 : 200).json({ success: true, data: { id: record.id, rating: record.rating, storeId, userId } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error submitting rating' });
    }
};





