const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Departments = sequelize.define(
       'Departments',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
           },
           name: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           date_created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'departments',
           timestamps: true,
           createdAt: 'date_created',
           updatedAt: false,
       }
   );

   module.exports = Departments;