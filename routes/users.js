const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const {getAccess} = require('../middleware/authenticate');
const { validateUserFields, validateLoginHeaders } = require('../validator');


router.use(validateLoginHeaders);

router.get('/', getAccess(true, false), usersController.getUsers);

router.get('/firstlogin', (req, res, next) => {
  res.render('form', { githubId: req.session.user.id });
});
router.put('/admin/:id', usersController.setUserAsAdmin);

router.get('/document/:document', usersController.getUserByDocument);

router.get('/:id', usersController.getUser);

router.post('/', getAccess(true, true), (req, res) => {
  const user = req.body;
  const validationErrors = validateUserFields(user);

  if (validationErrors.length > 0) {
    return res.status(422).json({ error: 'Validation Error', errors: validationErrors });
  }
  usersController.createUser(req, res);
});

router.put('/:id', usersController.updateUser);
router.delete('/:id', getAccess(true), usersController.deleteUser);

module.exports = router;
