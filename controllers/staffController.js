const { Staff } = require('../models');

exports.getStaffList = async (req, res) => {
    try {
        const staffList = await Staff.findAll({
            attributes: ['id', 'firstname', 'lastname'],
            raw: true,
        });

        // Map to desired response format
        const data = staffList.map(staff => ({
            id: staff.id,
            firstname: staff.firstname,
            lastname: staff.lastname,
        }));

        return res.status(200).json({
            status: true,
            message: 'Staff list retrieved successfully',
            data,
        });
    } catch (error) {
        console.error('Staff list error:', error);
        return res.status(500).json({
            status: false,
            message: 'Server error',
            data: [],
        });
    }
};