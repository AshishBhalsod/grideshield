const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Supplier = sequelize.define(
       'Supplier',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           companyName: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           name: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           gst: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           phone: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           email: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           createdDate: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
           user_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
       },
       {
           tableName: 'supplier',
           timestamps: true,
           updatedAt: 'createdDate',
           createdAt: false,
       }
   );

   module.exports = Supplier;