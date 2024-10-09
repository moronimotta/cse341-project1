const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const {getAccess} = require('../middleware/authenticate');
const { validateUserFields, validateLoginHeaders } = require('../validator');


router.use(validateLoginHeaders);

router.get('/', getAccess(true, true), usersController.getUsers);

router.get('/firstlogin', (req, res, next) => {
  res.render('form', { githubId: req.session.user.id });
});
router.post('/admin/:id', usersController.setUserAsAdmin);

router.get('/:id', usersController.getUser);

router.post('/', (req, res) => {
  const user = req.body;
  const validationErrors = validateUserFields(user);

  if (validationErrors.length > 0) {
    return res.status(422).json({ errors: validationErrors });
  }

  usersController.createUser(req, res);
});

router.put('/:id', usersController.updateUser);
router.delete('/:id', getAccess(true), usersController.deleteUser);

module.exports = router;
