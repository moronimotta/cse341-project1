const router = require('express').Router();
const transactionsController = require('../controllers/transactions');
const {getAccess} = require('../middleware/authenticate');

router.get('/', getAccess(true), transactionsController.getTransactions);
router.get('/:userid', getAccess(false, true), transactionsController.getAccountTransactions);

module.exports = router;