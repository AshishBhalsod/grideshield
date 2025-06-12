const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const restrictMethods = require('../middleware/restrictMethods');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');


// Task count route (GET only)
router.all('/count',auth, restrictMethods('GET'), taskController.getTaskCounts);

// Add task route (POST only)
router.all('/add', upload,auth, restrictMethods('POST'), taskController.addTask);
// Task list route (GET)
router.all('/task_list', auth, restrictMethods('GET'), taskController.getTaskList);

module.exports = router;