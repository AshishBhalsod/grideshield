const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const restrictMethods = require('../middleware/restrictMethods');

// Login route (POST only)
router.all('/login', restrictMethods('POST'), authController.login);

module.exports = router;