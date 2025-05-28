const jwt = require('jsonwebtoken');
   const { User } = require('../models');

   exports.login = async (req, res) => {
       const { username, password } = req.body;

       try {
           const user = await User.findOne({ where: { username, password } });
           if (!user) {
               return res.status(401).json({ message: 'Invalid credentials' });
           }

           const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
               expiresIn: '1h',
           });

           res.json({ token });
       } catch (error) {
           res.status(500).json({ message: 'Server error', error });
       }
   };