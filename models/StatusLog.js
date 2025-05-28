const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const StatusLog = sequelize.define(
       'StatusLog',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           current_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           old_status: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           old_child_status: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           new_status: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           new_child_status: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           changed_by: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           page_name: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           change_time: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'status_log',
           timestamps: true,
           updatedAt: 'change_time',
           createdAt: false,
       }
   );

   module.exports = StatusLog;