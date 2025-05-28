const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const StockItem = sequelize.define(
       'StockItem',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           name: {
               type: DataTypes.STRING(250),
               allowNull: false,
           },
           category: {
               type: DataTypes.STRING(250),
               allowNull: false,
           },
           code: {
               type: DataTypes.STRING(250),
               allowNull: false,
           },
           itemMinumumQtyAlert: {
               type: DataTypes.STRING(10),
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           users_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           createdBy: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'stock_item',
           timestamps: true,
           updatedAt: 'createdBy',
           createdAt: false,
       }
   );

   module.exports = StockItem;