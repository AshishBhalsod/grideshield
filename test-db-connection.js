const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create Sequelize instance with environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        dialect: 'mysql',
        logging: (msg) => console.log(msg), // Log SQL queries for debugging
        dialectOptions: {
            connectTimeout: 60000, // 60-second timeout
        },
    }
);

// Function to test the connection
async function testConnection() {
    try {
        // Attempt to authenticate (connect) to the database
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Query the list of databases to verify access
        const [databases] = await sequelize.query('SHOW DATABASES');
        console.log('Available databases:', databases.map(db => db.Database));

        // Check if the specified database exists
        const dbName = process.env.DB_NAME;
        if (!databases.some(db => db.Database === dbName)) {
            console.warn(`⚠️ Database '${dbName}' not found in available databases.`);
        } else {
            // Query the list of tables in the specified database
            const [tables] = await sequelize.query('SHOW TABLES');
            console.log('Tables in database:', tables.map(row => Object.values(row)[0]));
        }

        // Close the connection
        await sequelize.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:');
        console.error('Error:', error.message);
        console.error('Full error:', error);
        if (error.original && error.original.sqlMessage) {
            console.error('SQL Error:', error.original.sqlMessage);
        }
    }
}

// Run the test
testConnection();