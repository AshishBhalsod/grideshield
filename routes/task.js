const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const restrictMethods = require('../middleware/restrictMethods');

// Task count route (GET only)
router.all('/count', restrictMethods('GET'), taskController.getTaskCounts);

module.exports = router;