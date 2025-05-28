const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Internal = sequelize.define(
       'Internal',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           subject: {
               type: DataTypes.STRING(300),
               allowNull: false,
           },
           dueDate: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           staff_id: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           status: {
               type: DataTypes.INTEGER(10),
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           companyName: {
               type: DataTypes.STRING(200),
               allowNull: true,
           },
           inquiry_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           customer_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           admin_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           createdBy: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'internal',
           timestamps: true,
           updatedAt: 'createdBy',
           createdAt: false,
       }
   );

   module.exports = Internal;