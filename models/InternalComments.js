const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const InternalComments = sequelize.define(
       'InternalComments',
       {
           id: {
               type: DataTypes.INTEGER(11),
               autoIncrement: true,
               primaryKey: true,
           },
           user_id: {
               type: DataTypes.INTEGER(10),
               allowNull: false,
           },
           user_type: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           internal_id: {
               type: DataTypes.INTEGER(11),
               allowNull: false,
           },
           comment: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           date_created: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'internal_comments',
           timestamps: true,
           updatedAt: 'date_created',
           createdAt: false,
       }
   );

   module.exports = InternalComments;