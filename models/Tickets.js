const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const Tickets = sequelize.define(
       'Tickets',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
           },
           subject: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           description: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           status: {
               type: DataTypes.TINYINT(1),
               allowNull: false,
               comment: '0=Pending, 1=on process, 2=Closed',
           },
           department_id: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           customer_id: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           staff_id: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           admin_id: {
               type: DataTypes.INTEGER(30),
               allowNull: false,
           },
           dueDate: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           date_created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'tickets',
           timestamps: true,
           createdAt: 'date_created',
           updatedAt: false,
       }
   );

   module.exports = Tickets;