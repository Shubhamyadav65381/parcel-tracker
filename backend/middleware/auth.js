const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid token' });
  }
};
exports.ensureAuth = (req, res, next) => {
  if (req.session.token) {
    return next();
  }
  res.redirect('/login');
};

exports.ensureUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') {
    return next();
  }
  res.redirect('/');
};

exports.ensureAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/');
};

module.exports = auth;
