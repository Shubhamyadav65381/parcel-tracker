const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/api/users/register', registerUser);
router.post('/api/users/login', loginUser);

module.exports = router;
