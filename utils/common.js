const multer = require('multer');
   const path = require('path');

   // Configure multer for photo uploads
   const storage = multer.diskStorage({
       destination: (req, file, cb) => {
           cb(null, 'uploads/');
       },
       filename: (req, file, cb) => {
           cb(null, Date.now() + path.extname(file.originalname));
       },
   });

   const upload = multer({
       storage,
       limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
       fileFilter: (req, file, cb) => {
           const filetypes = /jpeg|jpg|png/;
           const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
           const mimetype = filetypes.test(file.mimetype);

           if (extname && mimetype) {
               return cb(null, true);
           }
           // Return user-friendly error instead of throwing
           cb(null, false, new Error('Only images (jpeg, jpg, png) are allowed'));
       },
   }).single('photo');

   // Middleware to handle multer errors
   const uploadPhoto = (req, res, next) => {
       upload(req, res, (err) => {
           if (err) {
               // Handle multer-specific errors
               if (err instanceof multer.MulterError) {
                   return res.status(400).json({ message: `Upload error: ${err.message}` });
               }
               // Handle file filter error or other errors
               return res.status(400).json({ message: err.message });
           }
           next();
       });
   };

   module.exports = { upload: uploadPhoto };