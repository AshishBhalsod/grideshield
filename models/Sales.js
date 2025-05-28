const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Sales = sequelize.define(
       'Sales',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           sales_user_id: {
               type: DataTypes.STRING(50),
               allowNull: true,
           },
           companyName: {
               type: DataTypes.STRING(250),
               allowNull: false,
           },
           added_by: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           name: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           address: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           phone: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           city: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           state: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           email: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           reference: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           locationName: {
               type: DataTypes.STRING(150),
               allowNull: false,
           },
           locationPhoneNumber: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           servicePlan: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           amount: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           installationMedia: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           deviceIp: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           wanIp: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           lanIp: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           lanIpPool: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           lat: {
               type: DataTypes.STRING(150),
               allowNull: false,
           },
           expiryDate: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           registrationDate: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           startDate: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           status: {
               type: DataTypes.INTEGER(10),
               allowNull: false,
               defaultValue: 0,
           },
           lastUpdate: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'sales',
           timestamps: true,
           updatedAt: 'lastUpdate',
           createdAt: false,
       }
   );

   module.exports = Sales;