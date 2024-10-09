const usersController = require('../controllers/users');

const getAccess = (isAdminRequired = false, isPasswordRequired = false) => {
  return async (req, res, next) => {
    const {password } = req.headers;

    if (!password) {
      return res.status(400).json({ message: 'Password header is required' });
    }

    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'You need to be logged in' });
    }

    if (isPasswordRequired) {
      try {
        const user = await usersController.getUserByEmailAndPassword(req.session.dbUser.email, password);
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }

    if (isAdminRequired && req.session.dbUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can access this information' });
    }

    next(); 
  };
};

module.exports = { getAccess };