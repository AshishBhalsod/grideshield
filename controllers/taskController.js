const { Internal } = require('../models');

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