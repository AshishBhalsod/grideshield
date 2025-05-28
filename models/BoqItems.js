const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const BoqItems = sequelize.define(
       'BoqItems',
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
           message: {
               type: DataTypes.TEXT,
               allowNull: false,
           },
           createdBy: {
               type: DataTypes.DATE,
               defaultValue: DataTypes.NOW,
           },
       },
       {
           tableName: 'boq_items',
           timestamps: true,
           updatedAt: 'createdBy',
           createdAt: false,
       }
   );

   module.exports = BoqItems;