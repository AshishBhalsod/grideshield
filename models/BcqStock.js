const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const BcqStock = sequelize.define(
       'BcqStock',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
           },
           type: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           inquiry_id: {
               type: DataTypes.INTEGER(10),
               allowNull: false,
           },
           companyName: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           clientName: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           location: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           staff_id: {
               type: DataTypes.INTEGER(5),
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
           tableName: 'bcq_stock',
           timestamps: true,
           updatedAt: 'date_updated',
           createdAt: 'date_created',
       }
   );

   module.exports = BcqStock;