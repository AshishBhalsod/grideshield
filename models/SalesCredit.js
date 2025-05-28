const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const SalesCredit = sequelize.define(
       'SalesCredit',
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
           expiration_date: {
               type: DataTypes.DATEONLY,
               allowNull: false,
           },
           start_date: {
               type: DataTypes.DATEONLY,
               allowNull: false,
           },
           amount: {
               type: DataTypes.STRING(50),
               allowNull: false,
           },
           staff_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           createdDate: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'sales_creadit',
           timestamps: true,
           updatedAt: 'createdDate',
           createdAt: false,
       }
   );

   module.exports = SalesCredit;