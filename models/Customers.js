const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Customers = sequelize.define(
       'Customers',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
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
       },
       {
           tableName: 'customers',
           timestamps: true,
           createdAt: 'date_created',
           updatedAt: false,
       }
   );

   module.exports = Customers;