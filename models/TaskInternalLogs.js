const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const TaskInternalLogs = sequelize.define(
       'TaskInternalLogs',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           internal_id: {
               type: DataTypes.INTEGER(11),
               allowNull: true,
           },
           is_created: {
               type: DataTypes.STRING(50),
               allowNull: true,
           },
           old_staff_id: {
               type: DataTypes.STRING(50),
               allowNull: true,
           },
           new_staff_id: {
               type: DataTypes.STRING(50),
               allowNull: true,
           },
           changed_by: {
               type: DataTypes.STRING(50),
               allowNull: true,
           },
           change_time: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'task_internal_logs',
           timestamps: true,
           updatedAt: 'change_time',
           createdAt: false,
       }
   );

   module.exports = TaskInternalLogs;