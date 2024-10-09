const router = require('express').Router();
const bankAccountController = require('../controllers/bank-account');
const {getAccess} = require('../middleware/authenticate');
const { validateLoginHeaders } = require('../validator');


// router.use(validateLoginHeaders);

router.get('/', bankAccountController.getBankAccs);
// router.get('/:id', getAccess(true), bankAccountController.getBankAcc);
// router.post('/', getAccess(), bankAccountController.createBankAcc);
// router.put('/:id', getAccess(), bankAccountController.updateBankAcc);
// router.delete('/:id', getAccess(true), bankAccountController.deleteBankAcc);
// router.post('/transfer/:sourceid/:destid', getAccess(), bankAccountController.transferMoney);

router.get('/', bankAccountController.getBankAccs);
router.get('/:id', bankAccountController.getBankAcc);
router.post('/', bankAccountController.createBankAcc);
router.put('/:id', bankAccountController.updateBankAcc);
router.delete('/:id', bankAccountController.deleteBankAcc);
router.post('/transfer/:sourceid/:destid', bankAccountController.transferMoney);

module.exports = router;