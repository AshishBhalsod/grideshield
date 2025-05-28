const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Staff = sequelize.define(
       'Staff',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
           },
           department_id: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           permission: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           sales_permission: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           firstname: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           lastname: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           middlename: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           contact: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           address: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           email: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           password: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           date_created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
           staff_email: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
       },
       {
           tableName: 'staff',
           timestamps: true,
           createdAt: 'date_created',
           updatedAt: false,
       }
   );

   module.exports = Staff;