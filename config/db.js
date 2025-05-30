const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306, // Default to 3306 if not specified
        dialect: 'mysql',
        logging: (msg) => console.log(msg), // Log SQL queries
    }
);

module.exports = sequelize;