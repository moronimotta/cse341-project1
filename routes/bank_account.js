const router = require('express').Router();
const bankAccountController = require('../controllers/bank-account');


router.get('/', bankAccountController.getBankAcc);
router.get('/:id', bankAccountController.getBankAccs);
router.post('/', bankAccountController.updateBankAcc);
router.put('/:id', bankAccountController.createBankAcc);
router.delete('/:id', bankAccountController.deleteBankAcc);

module.exports = router;