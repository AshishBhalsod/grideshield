const { Internal, TaskInternalLogs, User, Staff, InternalComments,Inquiry, ServicePlan, InquiryCategory, InquiryCategorySub, Documents } = require('../models');
const path = require('path');


const statusMap = {
    'Pending': 0,
    'Processing': 1,
    'Waiting For Customer Task': 2,
    'Done': 3,
    'Close': 4
};

const reverseStatusMap = {
    0: 'Pending',
    1: 'Processing',
    2: 'Waiting For Customer Task',
    3: 'Done',
    4: 'Close'
};

const userTypeMap = {
    'admin': 1,
    'staff': 2
};

const reverseUserTypeMap = {
    1: 'admin',
    2: 'staff'
};

// Helper function to fetch usernames
const fetchUsernames = async (ids, userType) => {
    if (!ids) return [];
    const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (idArray.length === 0) return [];

    const Model = userType === 'staff' ? Staff : User;
    const field = userType === 'staff' ? 'firstname' : 'username';
    const users = await Model.findAll({
        where: { id: idArray },
        attributes: ['id', field],
        raw: true,
    });
    return idArray.map(id => {
        const user = users.find(u => u.id === id);
        return {
            id,
            username: user ? user[field] : null
        };
    });
};
const fetchCommentUserName = async (user_id, user_type) => {
    const Model = user_type === 2 ? Staff : User;
    const user = await Model.findOne({
        where: { id: user_id },
        attributes: ['firstname'],
        raw: true,
    });
    return user ? user.firstname : 'Unknown';
};

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
        statusMap.push({ name: 'totalCount', id: -1, totalCount });

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
        const files = req.files; // Array of files

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
        // Validate usertype
        if (!req.user.usertype || !['staff', 'user'].includes(req.user.usertype)) {
            return res.status(400).json({
                status: false,
                message: 'req.user.usertype must be "staff" or "user"',
                data: {},
            });
        }
        // Process file paths
        let attachmentPaths = [];
        if (files && files.length > 0) {
            attachmentPaths = files.map(file => `uploads/${file.filename}`);
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
            attachment: attachmentPaths.length > 0 ? attachmentPaths : null,
        });

        // Create task_internal_logs entry
        await TaskInternalLogs.create({
            internal_id: task.id,
            is_created: req.user.firstname,
            old_staff_id: staff_id,
            new_staff_id: staff_id,
            changed_by: req.user.firstname,
        });
         // Create internal_comments entry
        await InternalComments.create({
            user_id: parseInt(admin_id, 10),
            user_type: userTypeMap[req.user.usertype],
            internal_id: task.id,
            comment: message,
            attachment: attachmentPaths.length > 0 ? attachmentPaths : null,
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
        console.error('Add task error:', {
            message: error.message,
            stack: error.stack,
            files: req.files ? req.files.map(f => f.originalname) : 'No files'
        });
        if (error.message.includes('Invalid file format')) {
            return res.status(400).json({
                status: false,
                message: error.message,
                data: {},
            });
        }
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
        if (status === undefined || ![-1, 0, 1, 2, 3, 4].includes(Number(status))) {
            return res.status(400).json({
                status: false,
                message: 'status is required and must be one of: -1, 0, 1, 2, 3, 4',
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

        // Query internal table with sorting by created_at DESC
        const whereClause = Number(status) === -1 ? {} : { status: Number(status) };
        const tasks = await Internal.findAll({
            where: whereClause,
            attributes: ['id', 'status', 'subject', 'dueDate', 'inquiry_id', 'createdBy'],
            order: [['createdBy', 'DESC']],
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
                status: statusMap[task.status] || 'Unknown',
                subject: task.subject,
                dueDate: task.dueDate,
                inquiry_id: task.inquiry_id,
                username: log ? log.is_created : null,
                createdBy: task.createdBy
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


// exports.getTaskDetail = async (req, res) => {
//     try {
//         // Validate request body
//         if (!req.body || Object.keys(req.body).length === 0) {
//             return res.status(400).json({
//                 status: false,
//                 message: 'Request body is empty',
//                 data: {},
//             });
//         }

//         const { task_id, userType } = req.body;

//         // Validate task_id
//         if (!task_id || !/^\d+$/.test(task_id) || task_id <= 0) {
//             return res.status(400).json({
//                 status: false,
//                 message: 'task_id is required and must be a positive integer',
//                 data: {},
//             });
//         }

//         // Validate userType
//         if (!userType || !['staff', 'users'].includes(userType)) {
//             return res.status(400).json({
//                 status: false,
//                 message: 'userType is required and must be "staff" or "users"',
//                 data: {},
//             });
//         }

//         // Status mapping
//         const statusMap = {
//             0: 'Pending',
//             1: 'Processing',
//             2: 'Waiting For Customer Task',
//             3: 'Done',
//             4: 'Close'
//         };

//         // Fetch task from internal table
//         const task = await Internal.findOne({
//             where: { id: task_id },
//             attributes: ['id', 'subject', 'status', 'dueDate', 'staff_id', 'description', 'attachment','createdBy'],
//             raw: true,
//         });

//         if (!task) {
//             return res.status(404).json({
//                 status: false,
//                 message: 'Task not found',
//                 data: {},
//             });
//         }

//         // Fetch usernames for assign_to
//         const assignTo = await fetchUsernames(task.staff_id, userType);

//         // Fetch logs from task_internal_logs
//         const logs = await TaskInternalLogs.findAll({
//             where: { internal_id: task_id },
//             attributes: ['is_created', 'changed_by', 'change_time', 'new_staff_id'],
//             order: [['change_time', 'ASC']],
//             raw: true,
//         });

//         // Fetch comments from internal_comments
//         const comments = await InternalComments.findAll({
//             where: { internal_id: task_id },
//             attributes: ['user_id', 'user_type', 'comment', 'date_created', 'attachment'],
//             order: [['date_created', 'ASC']],
//             raw: true,
//         });

//         // Map logs to include all assign_from, changed_by, changed_time, assign_to_staff
//         const logDetails = await Promise.all(logs.map(async (log) => {
//             const assignToStaff = log.new_staff_id ? await fetchUsernames(log.new_staff_id, userType) : [];
//             return {
//                 assign_from: log.is_created,
//                 changed_by: log.changed_by,
//                 changed_time: log.change_time,
//                 assign_to_staff: assignToStaff
//             };
//         }));

//         // Prepare response data
//         const taskDetail = {
//             subject: task.subject,
//             description:task.description,
//             attachment:task.attachment ? JSON.parse(task.attachment):[],
//             createdBy:task.createdBy,
//             status: statusMap[task.status] || 'Unknown',
//             due_date: task.dueDate,
//             assign_to: assignTo,
//             logs: logDetails,
//             comments_attachments: comments.map(comment => ({
//                 name: comment.user_id,
//                 user_type: reverseUserTypeMap[comment.user_type] || 'Unknown',
//                 comment: comment.comment,
//                 comment_date: comment.date_created,
//                 attachments: comment.attachment ? JSON.parse(comment.attachment) : []
//             }))
//         };

//         return res.status(200).json({
//             status: true,
//             message: 'Task details retrieved successfully',
//             data: taskDetail,
//         });
//     } catch (error) {
//         console.error('Get task detail error:', error);
//         return res.status(500).json({
//             status: false,
//             message: 'Server error',
//             data: {},
//         });
//     }
// };
exports.getTaskDetail = async (req, res) => {
    try {
        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Request body is empty',
                data: {},
            });
        }

        const { task_id, userType } = req.body;

        // Validate task_id
        if (!task_id || !/^\d+$/.test(task_id) || task_id <= 0) {
            return res.status(400).json({
                status: false,
                message: 'task_id is required and must be a positive integer',
                data: {},
            });
        }

        // Validate userType
        if (!userType || !['staff', 'users'].includes(userType)) {
            return res.status(400).json({
                status: false,
                message: 'userType is required and must be "staff" or "users"',
                data: {},
            });
        }

        // Status mapping
        const statusMap = {
            0: 'Pending',
            1: 'Processing',
            2: 'Waiting For Customer Task',
            3: 'Done',
            4: 'Close'
        };

        // Fetch task from internal table
        const task = await Internal.findOne({
            where: { id: task_id },
            attributes: ['id', 'subject', 'status', 'dueDate', 'staff_id', 'description', 'attachment', 'createdBy'],
            raw: true,
        });

        if (!task) {
            return res.status(404).json({
                status: false,
                message: 'Task not found',
                data: {},
            });
        }

        // Fetch usernames for assign_to
        const assignTo = await fetchUsernames(task.staff_id, userType);

        // Fetch logs from task_internal_logs
        const logs = await TaskInternalLogs.findAll({
            where: { internal_id: task_id },
            attributes: ['is_created', 'changed_by', 'change_time', 'new_staff_id'],
            order: [['change_time', 'ASC']],
            raw: true,
        });

        // Fetch comments from internal_comments
        const comments = await InternalComments.findAll({
            where: { internal_id: task_id },
            attributes: ['user_id', 'user_type', 'comment', 'date_created', 'attachment'],
            order: [['date_created', 'ASC']],
            raw: true,
        });

        // Map logs to include all assign_from, changed_by, changed_time, assign_to_staff
        const logDetails = await Promise.all(logs.map(async (log) => {
            const assignToStaff = log.new_staff_id ? await fetchUsernames(log.new_staff_id, userType) : [];
            return {
                assign_from: log.is_created,
                changed_by: log.changed_by,
                changed_time: log.change_time,
                assign_to_staff: assignToStaff
            };
        }));

        // Fetch usernames for comments
        const commentsWithNames = await Promise.all(comments.map(async (comment) => {
            const name = await fetchCommentUserName(comment.user_id, comment.user_type);
            return {
                name,
                user_type: reverseUserTypeMap[comment.user_type] || 'Unknown',
                comment: comment.comment,
                comment_date: comment.date_created,
                attachments: comment.attachment ? JSON.parse(comment.attachment) : []
            };
        }));

        // Prepare response data
        const taskDetail = {
            subject: task.subject,
            description: task.description,
            attachment: task.attachment ? JSON.parse(task.attachment) : [],
            createdBy: task.createdBy,
            status: statusMap[task.status] || 'Unknown',
            due_date: task.dueDate,
            assign_to: assignTo,
            logs: logDetails,
            comments_attachments: commentsWithNames
        };

        return res.status(200).json({
            status: true,
            message: 'Task details retrieved successfully',
            data: taskDetail,
        });
    } catch (error) {
        console.error('Get task detail error:', error);
        return res.status(500).json({
            status: false,
            message: 'Server error',
            data: {},
        });
    }
};
exports.editTask = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Request body is empty',
                data: {},
            });
        }

        const { task_id, status, due_date, staff_id, user_id, user_type, internal_id, comment } = req.body;
        const files = req.files;

        if (!task_id || !/^\d+$/.test(task_id) || task_id <= 0) {
            return res.status(400).json({
                status: false,
                message: 'task_id is required and must be a positive integer',
                data: {},
            });
        }

        const task = await Internal.findOne({ where: { id: task_id } });
        if (!task) {
            return res.status(404).json({
                status: false,
                message: 'Task not found',
                data: {},
            });
        }

        const updates = {};

        if (status && statusMap[status] !== undefined) {
            updates.status = statusMap[status];
        }

        if (due_date) {
            updates.dueDate = due_date;
        }

        if (staff_id) {
            const staffIds = staff_id.split(',').map(id => id.trim());
            if (!staffIds.every(id => /^\d+$/.test(id))) {
                return res.status(400).json({
                    status: false,
                    message: 'staff_id must be comma-separated integers (e.g., "3,4")',
                    data: {},
                });
            }
            updates.staff_id = staff_id;
        }

        let commentId = null;
        if (comment) {
            if (!user_id || !/^\d+$/.test(user_id) || !user_type || !['staff', 'admin'].includes(user_type) || !internal_id || internal_id != task_id) {
                return res.status(400).json({
                    status: false,
                    message: 'user_id, user_type (staff or admin), internal_id (matching task_id), and comment are required for adding a comment',
                    data: {},
                });
            }

            let attachmentPaths = [];
            if (files && files.length > 0) {
                attachmentPaths = files.map(file => `uploads/${file.filename}`);
            }

            const newComment = await InternalComments.create({
                user_id: parseInt(user_id, 10),
                user_type: userTypeMap[user_type],
                internal_id: parseInt(internal_id, 10),
                comment,
                attachment: attachmentPaths.length > 0 ? attachmentPaths : null,
            });

            commentId = newComment.id;
        }
        if (staff_id) {
            await TaskInternalLogs.create({
                internal_id: task_id,
                is_created: req.user.firstname,
                old_staff_id: staff_id,
                new_staff_id: staff_id,
                changed_by: req.user.firstname,
            });
        }
        if (Object.keys(updates).length > 0) {
            await Internal.update(updates, { where: { id: task_id } });
        }

        const updatedTask = await Internal.findOne({
            where: { id: task_id },
            attributes: ['id', 'subject', 'status', 'dueDate', 'staff_id', 'description', 'attachment'],
            raw: true,
        });

        return res.status(200).json({
            status: true,
            message: 'Task updated successfully',
            data: {
                id: updatedTask.id,
                subject: updatedTask.subject,
                status: reverseStatusMap[updatedTask.status],
                dueDate: updatedTask.dueDate,
                staff_id: updatedTask.staff_id,
                description: updatedTask.description,
                attachment: updatedTask.attachment,
                comment_id: commentId
            },
        });
    } catch (error) {
        console.error('Edit task error:', {
            message: error.message,
            stack: error.stack,
            files: req.files ? req.files.map(f => f.originalname) : 'No files'
        });
        if (error.message.includes('Invalid file format')) {
            return res.status(400).json({
                status: false,
                message: error.message,
                data: {},
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FIELD') {
            return res.status(400).json({
                status: false,
                message: 'Unexpected field in file upload. Use "files[]" as the field name.',
                data: {},
            });
        }
        return res.status(500).json({
            status: false,
            message: 'Server error',
            data: {},
        });
    }
};


exports.viewInquiry = async (req, res) => {
    try {
        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Request body is empty',
                data: {},
            });
        }

        const { inquiry_id } = req.body;

        // Validate inquiry_id
        if (!inquiry_id || !/^\d+$/.test(inquiry_id) || inquiry_id <= 0) {
            return res.status(400).json({
                status: false,
                message: 'inquiry_id is required and must be a positive integer',
                data: {},
            });
        }

        // Fetch inquiry from inquiry table
        const inquiry = await Inquiry.findOne({
            where: { id: inquiry_id },
            attributes: ['companyName', 'name', 'phone', 'city', 'state', 'inquiry_source', 'inquiry_name', 'mail_id', 'status', 'sub_status', 'servicePlan'],
            raw: true,
        });

        if (!inquiry) {
            return res.status(404).json({
                status: false,
                message: 'Inquiry not found',
                data: {},
            });
        }

        // Fetch service plan details
        let servicePlan = {};
        if (inquiry.servicePlan && /^\d+$/.test(inquiry.servicePlan)) {
            const service = await ServicePlan.findOne({
                where: { id: parseInt(inquiry.servicePlan, 10) },
                attributes: ['id', 'name'],
                raw: true,
            });
            servicePlan = service ? { id: service.id, name: service.name } : { id: parseInt(inquiry.servicePlan, 10), name: 'Unknown' };
        } else {
            servicePlan = { id: null, name: null };
        }

        // Fetch status (inquiry_category.name)
        let statusName = 'Unknown';
        if (inquiry.status) {
            const category = await InquiryCategory.findOne({
                where: { id: inquiry.status },
                attributes: ['name'],
                raw: true,
            });
            statusName = category ? category.name : 'Unknown';
        }

        // Fetch sub_status (inquiry_category_sub.subcategory_name)
        let subStatusName = 'Unknown';
        if (inquiry.sub_status) {
            const subCategory = await InquiryCategorySub.findOne({
                where: { id: inquiry.sub_status },
                attributes: ['subcategory_name'],
                raw: true,
            });
            subStatusName = subCategory ? subCategory.subcategory_name : 'Unknown';
        }

        // Fetch documents with documentType = 2
        const documents = await Documents.findAll({
            where: { inquiry_id, documentType: 2 },
            attributes: ['id', 'inquiry_id', 'filename', 'title', 'uploaded_by', 'documentType', 'CreatedDate'],
            raw: true,
        });

        // Prepare response data
        const inquiryDetail = {
            companyName: inquiry.companyName,
            name: inquiry.name,
            phone: inquiry.phone,
            city: inquiry.city,
            state: inquiry.state,
            inquiry_source: inquiry.inquiry_source,
            inquiry_name: inquiry.inquiry_name,
            mail_id: inquiry.mail_id,
            status: statusName,
            sub_status: subStatusName,
            servicePlan,
            documentList: documents
        };

        return res.status(200).json({
            status: true,
            message: 'Inquiry details retrieved successfully',
            data: inquiryDetail,
        });
    } catch (error) {
        console.error('View inquiry error:', error);
        return res.status(500).json({
            status: false,
            message: 'Server error',
            data: {},
        });
    }
};