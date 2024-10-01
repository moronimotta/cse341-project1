const router = require('express').Router();

router.use('/', require('./swagger'));

router.use('/bank-accounts', require('./bank_account'));
router.use('/users', require('./users'));

module.exports = router;