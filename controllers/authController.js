const jwt = require('jsonwebtoken');
const { User, Staff } = require('../models');

exports.login = async (req, res) => {
    try {
        // Check for empty or missing request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Request body is empty',
                data: {},
            });
        }
        const { usertype, username, password } = req.body;
        // Validate input fields
        if (!usertype || !username || !password) {
            return res.status(400).json({
                status: false,
                message: 'usertype, username, and password are required',
                data: {},
            });
        }

        if (!['users', 'staff'].includes(usertype)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid usertype. Must be "users" or "staff"',
                data: {},
            });
        }

        let userData;
        let tokenPayload;

        if (usertype === 'users') {
            // Check users table
            userData = await User.findOne({ where: { username } });
            if (!userData || userData.password !== password) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid username or password',
                    data: {},
                });
            }

            // Prepare user details directly for data object
            userData = {
                id: userData.id,
                firstname: userData.firstname,
                middlename: userData.middlename,
                lastname: userData.lastname,
                username: userData.username,
            };

            // Token payload
            tokenPayload = {
                id: userData.id,
                username: userData.username,
                usertype: 'users',
            };
        } else {
            // Check staff table (using email)
            userData = await Staff.findOne({ where: { email: username } });
            if (!userData || userData.password !== password) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid email or password',
                    data: {},
                });
            }

            // Prepare staff details directly for data object
            userData = {
                id: userData.id,
                firstname: userData.first_name,
                middlename: userData.middle_name || '',
                lastname: userData.last_name,
                contact: userData.contact,
                email: userData.email,
                staff_email: userData.staff_email,
                departmentid: userData.department_id,
            };

            // Token payload
            tokenPayload = {
                id: userData.id,
                email: userData.email,
                usertype: 'staff',
            };
        }

        // Generate JWT token
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return response with flattened data
        return res.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
                ...userData,
                token,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: false,
            message: 'Server error',
            data: {},
        });
    }
};