const jwt = require('jsonwebtoken');
const axios = require('axios');
exports.ensureAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

exports.ensureAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
  next();
};

exports.ensureUser = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'user') return res.redirect('/login');
  next();
};
module.exports.ensureAuth = (req, res, next) => {
  if (!req.session.token) {
    return res.redirect('/login');
  }
  next();
};

module.exports.ensureAdmin = (req, res, next) => {
  if (req.session.user?.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }
  next();
};
