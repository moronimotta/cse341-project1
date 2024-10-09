const router = require('express').Router();
const transactionsController = require('../controllers/transactions');
const {getAccess} = require('../middleware/authenticate');
const { validateLoginHeaders } = require('../validator');


// router.use(validateLoginHeaders);

// router.get('/', getAccess(true), transactionsController.getTransactions);
// router.get('/:userid', getAccess(true), transactionsController.getAccountTransactions);
// router.post('/', getAccess(true), transactionsController.createTransaction);


router.get('/', transactionsController.getTransactions);
router.get('/:userid', transactionsController.getAccountTransactions);
router.post('/', transactionsController.createTransaction);

module.exports = router;