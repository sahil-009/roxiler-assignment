const Joi = require('joi');

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const registerSchema = Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).allow(null, ''),
    password: Joi.string().pattern(passwordRegex).required(),
    role: Joi.string().valid('user', 'admin', 'owner').default('user')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const createUserSchema = Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).allow(null, ''),
    password: Joi.string().pattern(passwordRegex).required(),
    role: Joi.string().valid('user', 'admin', 'owner').default('user')
});

const updatePasswordSchema = Joi.object({
    password: Joi.string().pattern(passwordRegex).required()
});

const createStoreSchema = Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).allow(null, ''),
    ownerId: Joi.number().integer().allow(null)
});

const updateStoreSchema = Joi.object({
    name: Joi.string().min(20).max(60),
    email: Joi.string().email(),
    address: Joi.string().max(400),
    ownerId: Joi.number().integer().allow(null)
});

const ratingSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required()
});

module.exports = {
    registerSchema,
    loginSchema,
    createUserSchema,
    updatePasswordSchema,
    createStoreSchema,
    updateStoreSchema,
    ratingSchema
};