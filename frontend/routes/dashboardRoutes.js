const express = require('express');
const router = express.Router();
const axios = require('axios');
const { ensureAuth, ensureUser, ensureAdmin } = require('../middleware/auth');

// User Dashboard
router.get('/user', ensureAuth, ensureUser, (req, res) => {
  res.render('dashboards/user', {
    user: req.session.user
  });
});

// Admin Dashboard
router.get('/admin', ensureAuth, ensureAdmin, (req, res) => {
  res.render('dashboards/admin', {
    user: req.session.user
  });
});

module.exports = router;
