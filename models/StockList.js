const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const StockList = sequelize.define(
       'StockList',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
           },
           item_id: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           quantity: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           price: {
               type: DataTypes.FLOAT,
               allowNull: false,
               defaultValue: 0,
           },
           total: {
               type: DataTypes.FLOAT,
               allowNull: false,
               defaultValue: DataTypes.NOW,
           },
           type: {
               type: DataTypes.STRING(50),
               allowNull: false,
               defaultValue: '1',
               comment: '1=IN , 2=OUT',
           },
           date_created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'stock_list',
           timestamps: true,
           createdAt: 'date_created',
           updatedAt: false,
       }
   );

   module.exports = StockList;