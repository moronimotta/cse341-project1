const router = require('express').Router();
const bankAccountController = require('../controllers/bank-account');
const {getAccess} = require('../middleware/authenticate');

router.get('/', getAccess(true, false),bankAccountController.getBankAccs);
router.get('/:id', getAccess(false), bankAccountController.getBankAcc);
router.post('/', getAccess(false, true), bankAccountController.createBankAcc);
router.put('/:id', getAccess(false, true), bankAccountController.updateBankAcc);
router.delete('/:id', getAccess(false, true), bankAccountController.deleteBankAcc);
router.post('/transfer/:sourceid/:destid', getAccess(false, true), bankAccountController.transferMoney);


module.exports = router;