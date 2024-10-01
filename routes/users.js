const router = require('express').Router();
const usersController = require('../controllers/users');
const { validateLoginHeaders, getLogin, getAdmin } = require('../validator');

router.use(validateLoginHeaders);

router.get('/', getAdmin, usersController.getUsers); 
router.get('/:id', getLogin, usersController.getUser); 
router.post('/', getAdmin, usersController.createUser); 
router.put('/:id', getAdmin, usersController.updateUser); 
router.delete('/:id', getAdmin, usersController.deleteUser); 
module.exports = router;
