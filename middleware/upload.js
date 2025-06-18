const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for allowed extensions
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        '.jpg', '.jpeg', '.png', '.pdf',
        '.doc', '.docx', '.xls', '.xlsx',
        '.ppt', '.pptx', '.txt'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file format for ${file.originalname}. Allowed: JPG, PNG, PDF, DOC, XLS, PPT, TXT`), false);
    }
};

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
}).array('files[]'); // Handle multiple files with field name 'files[]'

module.exports = upload;