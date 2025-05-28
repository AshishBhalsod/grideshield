const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Documents = sequelize.define(
       'Documents',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           inquiry_id: {
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
           documentType: {
               type: DataTypes.INTEGER(11),
               allowNull: true,
           },
           CreatedDate: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'documents',
           timestamps: true,
           updatedAt: 'CreatedDate',
           createdAt: false,
       }
   );

   module.exports = Documents;