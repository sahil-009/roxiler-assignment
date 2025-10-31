const { type } = require('arktype');

// Define roles type
const Roles = type({
    'role?': '"user" | "admin" | "owner"'
});

// Register validation schema
const registerSchema = type({
    'username': 'string>2<31',
    'email': 'string>5',
    'password': 'string>7',
    'role?': '"user" | "admin" | "owner"'
});

// Login validation schema
const loginSchema = type({
    'email': 'string>5',
    'password': 'string'
});

// Update user validation schema
const updateUserSchema = type({
    'username?': 'string>2<31',
    'email?': 'string>5',
    'password?': 'string>7',
    'role?': '"user" | "admin" | "owner"'
});

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema,
    Roles
};