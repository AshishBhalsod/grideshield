const { Internal,TaskInternalLogs } = require('../models');
const path = require('path');
exports.getTaskCounts = async (req, res) => {
    try {
        // Query counts for each status
        const counts = await Internal.findAll({
            attributes: [
                'status',
                [Internal.sequelize.fn('COUNT', Internal.sequelize.col('id')), 'total'],
            ],
            group: ['status'],
            raw: true,
        });

        // Initialize result for all statuses
        const statusMap = [
            { name: 'pending', id: 0, totalCount: 0 },
            { name: 'processing', id: 1, totalCount: 0 },
            { name: 'waitingForCustomer', id: 2, totalCount: 0 },
            { name: 'done', id: 3, totalCount: 0 },
            { name: 'close', id: 4, totalCount: 0 },
        ];

        // Update counts from query
        let totalCount = 0;
        counts.forEach(({ status, total }) => {
            const index = statusMap.findIndex(item => item.id === status);
            if (index !== -1) {
                statusMap[index].totalCount = parseInt(total, 10);
                totalCount += statusMap[index].totalCount;
            }
        });

        // Add totalCount entry
        statusMap.push({ name: 'totalCount', id: null, totalCount });

        // Return response
        return res.status(200).json({
            status: true,
            message: 'Total count retrieved successfully',
            data: statusMap,
        });
    } catch (error) {
        console.error('Task count error:', error);
        return res.status(500).json({
            status: false,
            message: 'Server error',
            data: [],
        });
    }
};


exports.addTask = async (req, res) => {
    console.log(req.user)
    try {
        // Validate empty body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Request body is empty',
                data: {},
            });
        }

        // Extract form data
        const { subject, staff_id, name, dueDate, message, admin_id } = req.body;
        const file = req.file;

        // Validate required fields
        if (!subject || !staff_id || !dueDate || !message || !admin_id) {
            return res.status(400).json({
                status: false,
                message: 'subject, staff_id, dueDate, message, and admin_id are required',
                data: {},
            });
        }

        // Validate staff_id (comma-separated integers)
        const staffIds = staff_id.split(',').map(id => id.trim());
        if (!staffIds.every(id => /^\d+$/.test(id))) {
            return res.status(400).json({
                status: false,
                message: 'staff_id must be comma-separated integers (e.g., "3,4")',
                data: {},
            });
        }

        // Validate admin_id (integer)
        if (!/^\d+$/.test(admin_id)) {
            return res.status(400).json({
                status: false,
                message: 'admin_id must be an integer',
                data: {},
            });
        }

        // Validate file format if provided
        let attachmentPath = null;
        if (file) {
            const allowedExtensions = [
                '.jpg', '.jpeg', '.png', '.pdf',
                '.doc', '.docx', '.xls', '.xlsx',
                '.ppt', '.pptx', '.txt'
            ];
            const ext = path.extname(file.originalname).toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid file format. Allowed: JPG, PNG, PDF, DOC, XLS, PPT, TXT',
                    data: {},
                });
            }
            attachmentPath = `uploads/${file.filename}`;
        }

        // Create internal task
        const task = await Internal.create({
            subject,
            staff_id,
            companyName: name || null,
            dueDate,
            description: message,
            status: 0,
            inquiry_id: 0,
            customer_id: parseInt(admin_id, 10),
            admin_id: parseInt(admin_id, 10),
            attachment: attachmentPath,
        });

        // Create task_internal_logs entry
        await TaskInternalLogs.create({
            internal_id: task.id,
            is_created: req.user.firstname,
            old_staff_id: staff_id,
            new_staff_id: staff_id,
            changed_by: req.user.firstname,
        });

        // Return response
        return res.status(201).json({
            status: true,
            message: 'Task added successfully',
            data: {
                id: task.id,
                subject: task.subject,
                staff_id: task.staff_id,
                companyName: task.companyName,
                dueDate: task.dueDate,
                description: task.description,
                attachment: task.attachment,
            },
        });
    } catch (error) {
        console.error('Add task error:', error);
        return res.status(500).json({
            status: false,
            message: 'Server error',
            data: {},
        });
    }
};



exports.getTaskList = async (req, res) => {
    try {
        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Request body is empty',
                data: [],
            });
        }

        const { status } = req.body;

        // Validate status
        if (status === undefined || ![0, 1, 2, 3, 4].includes(Number(status))) {
            return res.status(400).json({
                status: false,
                message: 'status is required and must be one of: 0, 1, 2, 3, 4',
                data: [],
            });
        }

        // Map status to human-readable
        const statusMap = {
            0: 'Pending',
            1: 'Processing',
            2: 'Waiting For Customer Task',
            3: 'Done',
            4: 'Close'
        };

        // Query internal table
        const tasks = await Internal.findAll({
            where: { status: Number(status) },
            attributes: ['id', 'status', 'subject', 'dueDate', 'inquiry_id'],
            raw: true,
        });

        // Fetch usernames from task_internal_logs
        const taskData = await Promise.all(tasks.map(async (task) => {
            const log = await TaskInternalLogs.findOne({
                where: { internal_id: task.id },
                attributes: ['is_created'],
                raw: true,
            });

            return {
                id: task.id,
                status: statusMap[task.status],
                subject: task.subject,
                dueDate: task.dueDate,
                inquiry_id: task.inquiry_id,
                username: log ? log.is_created : null,
            };
        }));

        return res.status(200).json({
            status: true,
            message: 'Tasks retrieved successfully',
            data: taskData,
        });
    } catch (error) {
        console.error('Get task list error:', error);
        return res.status(500).json({
            status: false,
            message: 'Server error',
            data: [],
        });
    }
};