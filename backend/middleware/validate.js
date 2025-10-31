const validateRequest = (schema) => {
    return (req, res, next) => {
        const { data, problems } = schema(req.body);
        
        if (problems) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: problems.summary
            });
        }

        // Replace request body with validated data
        req.body = data;
        next();
    };
};

module.exports = validateRequest;