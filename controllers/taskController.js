const { Internal } = require('../models');
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
    try {
          if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Request body is empty',
                data: {},
            });
        }
        console.log(req.body)
        // Extract form data
        const { subject, staff_id, name, dueDate, message,admin_id } = req.body;
        const file = req.file;

        // Validate required fields
        if (!subject || !staff_id || !dueDate || !message) {
            return res.status(400).json({
                status: false,
                message: 'subject, staff_id, dueDate, and message are required',
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

        // Create task
        const task = await Internal.create({
            subject,
            staff_id, // Store as comma-separated string
            companyName: name || null,
            dueDate,
            description: message,
            status: 0, // Default to Pending
            inquiry_id: 1, // Placeholder
            customer_id: 1, // Placeholder
            admin_id: admin_id, // Placeholder
            attechment: attachmentPath,
        });
console.log( task)
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
                attachment: task.attechment,
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