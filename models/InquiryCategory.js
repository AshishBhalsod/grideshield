const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const InquiryCategory = sequelize.define(
       'InquiryCategory',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           name: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           order_number: {
               type: DataTypes.INTEGER(11),
               allowNull: true,
           },
           created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'inquiry_category',
           timestamps: true,
           updatedAt: 'created',
           createdAt: false,
       }
   );

   module.exports = InquiryCategory;