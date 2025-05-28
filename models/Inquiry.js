const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Inquiry = sequelize.define(
       'Inquiry',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           servicePlan: {
               type: DataTypes.STRING(250),
               allowNull: true,
           },
           added_by: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           highlight: {
               type: DataTypes.INTEGER(2),
               allowNull: false,
               defaultValue: 0,
           },
           priority: {
               type: DataTypes.INTEGER(5),
               allowNull: false,
           },
           companyName: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           name: {
               type: DataTypes.STRING(255),
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
           mail_id: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           filename: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           inquiry_source: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           inquiry_name: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           select_executive: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           createdDate: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
           originalDate: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           dueDate: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           status: {
               type: DataTypes.INTEGER(5),
               allowNull: false,
           },
           sub_status: {
               type: DataTypes.INTEGER(11),
               allowNull: true,
           },
       },
       {
           tableName: 'inquiry',
           timestamps: true,
           updatedAt: 'createdDate',
           createdAt: false,
       }
   );

   module.exports = Inquiry;