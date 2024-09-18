const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Hello, world!');
});

router.use('/users', require('./users')); 
router.use('/contacts', require('./contacts'));
module.exports = router;
