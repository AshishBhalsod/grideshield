const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const ServicePlan = sequelize.define(
       'ServicePlan',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           name: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           account_type: {
               type: DataTypes.STRING(255),
               allowNull: false,
           },
           account_days: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           unit_rate: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           staff_id: {
               type: DataTypes.INTEGER(10),
               allowNull: false,
           },
           createdDate: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'service_plan',
           timestamps: true,
           updatedAt: 'createdDate',
           createdAt: false,
       }
   );

   module.exports = ServicePlan;