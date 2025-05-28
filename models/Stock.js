const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Stock = sequelize.define(
       'Stock',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
           },
           stock_type: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           sales_code: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           amount: {
               type: DataTypes.FLOAT,
               allowNull: false,
               defaultValue: 0,
           },
           remarks: {
               type: DataTypes.TEXT,
               allowNull: true,
           },
           stock_ids: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           staff_id: {
               type: DataTypes.INTEGER(5),
               allowNull: false,
           },
           challanNo: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           invoiceNo: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           challanDate: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           transportName: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           transportCharge: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           LRNumber: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           date_created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
           date_updated: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'stock',
           timestamps: true,
           updatedAt: 'date_updated',
           createdAt: 'date_created',
       }
   );

   module.exports = Stock;