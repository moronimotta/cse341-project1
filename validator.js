const { check } = require('express-validator');

const validateLoginHeaders = [
    check('email').exists().isEmail().withMessage('Email is required and must be a valid email address.'),
    check('password').exists().isString().withMessage('Password is required and must be a string.'),
];

const validateUserFields = (user) => {
    const errors = [];

    if (!user.name || typeof user.name !== 'string') {
        errors.push('Name is required and must be a string.');
    }

    if (!user.last_name || typeof user.last_name !== 'string') {
        errors.push('Last name is required and must be a string.');
    }

    if (!user.age || typeof user.age !== 'number') {
        errors.push('Age is required and must be a number.');
    }

    if (!user.document || typeof user.document !== 'string') {
        errors.push('Document is required and must be a string.');
    }

    if (!user.password || typeof user.password !== 'string') {
        errors.push('Password is required and must be a string.');
    }

    if (!user.github_id || typeof user.github_id !== 'string') {
        errors.push('GitHub ID is required and must be a string.');
    }

    if (!user.location || typeof user.location !== 'string') {
        errors.push('Location is required and must be a string.');
    }

    return errors;
};
module.exports = {
    validateUserFields,
    validateLoginHeaders,
};
