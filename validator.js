const { check, validationResult } = require('express-validator');
const mongodb = require('./data/database');

const validateLoginHeaders = [
    check('email').exists().isEmail().withMessage('Invalid email address in headers'),
    check('password')
        .exists()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long in headers')
];

const getAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
            errors: extractedErrors,
        });
    }

    const { email, password } = req.headers;
    try {
        let db = mongodb.getDb();
        const result = await db.collection('users').find({ email: email, password: password });
        const users = await result.toArray();

        if (users.length > 0 && users[0].role === 'admin') {
            next();
        }
        else if (users.length > 0 && users[0].role !== 'admin') {
            return res.status(401).json({ message: 'Only admins can retrieve that information' });
        }
        else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
            errors: extractedErrors,
        });
    }

    const { email, password } = req.headers;
    try {
        let db = mongodb.getDb();
        const result = await db.collection('users').find({ email: email, password: password });
        const users = await result.toArray();

        if (users.length > 0) {
            req.user = users[0];
            req.role = users[0].role;
            next();
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAdmin,
    getLogin,
    validateLoginHeaders
};
