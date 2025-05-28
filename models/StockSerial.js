const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const StockSerial = sequelize.define(
       'StockSerial',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           item_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           number: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           stock_id: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           outward_stock_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           status: {
               type: DataTypes.STRING(10),
               allowNull: false,
           },
           CreatedBy: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'stock_serial',
           timestamps: true,
           updatedAt: 'CreatedBy',
           createdAt: false,
       }
   );

   module.exports = StockSerial;