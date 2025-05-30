const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const restrictMethods = require('../middleware/restrictMethods');
const auth = require('../middleware/auth');
// Staff list route (GET only)
router.all('/list', restrictMethods('GET'),auth, staffController.getStaffList);

module.exports = router;