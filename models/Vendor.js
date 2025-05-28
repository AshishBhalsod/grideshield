const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Vendor = sequelize.define(
       'Vendor',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           users_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           companyName: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           name: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           gst: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           phone: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           email: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           contactPersonalName: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           contactPersonalMobileNumber: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           referenceName: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'vendor',
           timestamps: true,
           updatedAt: 'created',
           createdAt: false,
       }
   );

   module.exports = Vendor;