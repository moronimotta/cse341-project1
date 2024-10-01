const router = require('express').Router();
const bankAccountController = require('../controllers/bank-account');
const { validateLoginHeaders, getLogin, getAdmin } = require('../validator');

router.use(validateLoginHeaders);

router.get('/', getLogin, bankAccountController.getBankAcc);
router.get('/:id', getAdmin, bankAccountController.getBankAccs);
router.post('/', getAdmin, bankAccountController.updateBankAcc);
router.put('/:id', getAdmin, bankAccountController.createBankAcc);
router.delete('/:id', getAdmin, bankAccountController.deleteBankAcc);

module.exports = router;