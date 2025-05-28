const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const InquiryCategorySub = sequelize.define(
       'InquiryCategorySub',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           subcategory_name: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           order_number: {
               type: DataTypes.INTEGER(11),
               allowNull: true,
           },
           parent_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           createdBy: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'inquiry_category_sub',
           timestamps: true,
           updatedAt: 'createdBy',
           createdAt: false,
       }
   );

   module.exports = InquiryCategorySub;