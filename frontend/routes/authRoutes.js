const express = require('express');
const router = express.Router();
const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000/api/users';

// Show register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Handle register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    await axios.post(`${BACKEND_URL}/register`, {
      name, email, password, role
    });
    res.redirect('/login');
  } catch (err) {
    res.render('auth/register', { error: err.response?.data?.msg || 'Registration failed' });
  }
});

// Show login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Handle login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post(`${BACKEND_URL}/login`, { email, password });
    const { token, user } = response.data;

    req.session.user = user;
    req.session.token = token;

    // Role-based redirection
    if (user.role === 'admin') {
      res.redirect('/dashboard/admin');
    } else {
      res.redirect('/dashboard/user');
    }
  } catch (err) {
    res.render('auth/login', { error: err.response?.data?.msg || 'Login failed' });
  }
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
