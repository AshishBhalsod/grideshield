const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const SalesImages = sequelize.define(
       'SalesImages',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           sales_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           filename: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           title: {
               type: DataTypes.STRING(250),
               allowNull: false,
           },
           uploaded_by: {
               type: DataTypes.INTEGER(5),
               allowNull: false,
           },
           CreatedDate: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'sales_images',
           timestamps: true,
           updatedAt: 'CreatedDate',
           createdAt: false,
       }
   );

   module.exports = SalesImages;