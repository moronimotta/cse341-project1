const router = require('express').Router();
const passport = require('passport');
const usersController = require('../controllers/users');

router.use('/swagger', require('./swagger'));
router.use('/bank-accounts', require('./bank_account'));
router.use('/transactions', require('./transactions')); 
router.use('/users', require('./users'));

router.get('/', (req, res) => { 
  res.send(req.session.user 
    ? `Logged in as ${req.session.user.displayName}` 
    : 'Logged Out'); 
});

router.get('/login', passport.authenticate('github'));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  async (req, res, next) => { 
    try {
      req.session.user = req.user;
      let user = await usersController.getUserByGithubId(req.session.user.id);
      req.session.dbUser = user;
      
      if (!user) {
        return res.redirect('/users/firstlogin'); 
      }

      return res.redirect('/'); 
    } catch (error) {
      console.error('Error in /auth/github/callback:', error);
      next(error); 
  }
}
);


router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { 
      console.error('Error during logout:', err);
      return next(err); 
    }

    req.session.destroy(err => {
      if (err) { 
        console.error('Error destroying session during logout:', err);
        return next(err); 
      }

      res.clearCookie('connect.sid', { path: '/' }); // Clear the session cookie
      console.log('User logged out and session destroyed.');
      res.redirect('/');
    });
  });
});




module.exports = router;
