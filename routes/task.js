const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const restrictMethods = require('../middleware/restrictMethods');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');


// Task count route (POST only)
router.all('/count',auth, restrictMethods('POST'), taskController.getTaskCounts);

// Add task route (POST only)
router.all('/add', upload,auth, restrictMethods('POST'), taskController.addTask);
// Task list route (POST)
router.all('/task_list', auth, restrictMethods('POST'), taskController.getTaskList);
// Task detail route (POST)
router.all('/task_list_detail', auth, restrictMethods('POST'), taskController.getTaskDetail);
// Task  Edit
router.all('/edit', upload, auth, restrictMethods('POST'), taskController.editTask);
//view Inquiery
router.post('/view_inquiry', auth, restrictMethods('POST'), taskController.viewInquiry);
module.exports = router;