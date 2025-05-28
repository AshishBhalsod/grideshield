const { DataTypes } = require('sequelize');
   const sequelize = require('../config/db');

   const BoqMasterItems = sequelize.define(
       'BoqMasterItems',
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
           tableName: 'boq_master_items',
           timestamps: true,
           updatedAt: 'createdBy',
           createdAt: false,
       }
   );

   module.exports = BoqMasterItems;