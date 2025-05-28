const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const User = sequelize.define(
       'User',
       {
           id: {
               type: DataTypes.INTEGER(30),
               autoIncrement: true,
               primaryKey: true,
           },
           firstname: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           middlename: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           lastname: {
               type: DataTypes.STRING(100),
               allowNull: false,
           },
           role: {
               type: DataTypes.TINYINT(1),
               allowNull: false,
               comment: '1 = Admin, 2 = support',
           },
           username: {
               type: DataTypes.STRING(200),
               allowNull: false,
           },
           password: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           date_created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'users',
           timestamps: false,
       }
   );

   module.exports = User;