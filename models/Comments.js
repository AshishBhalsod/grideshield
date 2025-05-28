const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Comments = sequelize.define(
       'Comments',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
           },
           user_id: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           user_type: {
               type: DataTypes.TINYINT(1),
               allowNull: false,
               comment: '1= admin, 2= staff, 3= customer',
           },
           ticket_id: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           comment: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           date_created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'comments',
           timestamps: true,
           createdAt: 'date_created',
           updatedAt: false,
       }
   );

   module.exports = Comments;