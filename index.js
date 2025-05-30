const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created.');
}

app.use(express.json());
app.use('/uploads', express.static(uploadsDir)); // Serve uploaded photos

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Database connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
        return sequelize.sync({ alter: false }); // Sync models without altering existing tables
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});