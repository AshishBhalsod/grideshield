const { Sequelize } = require('sequelize');
   const sequelize = require('../config/db');

   const User = require('./User');
   const BcqStock = require('./BcqStock');
   const BoqItems = require('./BoqItems');
   const BoqMasterItems = require('./BoqMasterItems');
   const Comments = require('./Comments');
   const Customers = require('./Customers');
   const Departments = require('./Departments');
   const Documents = require('./Documents');
   const Inquiry = require('./Inquiry');
   const InquiryCategory = require('./InquiryCategory');
   const InquiryCategorySub = require('./InquiryCategorySub');
   const InquiryComments = require('./InquiryComments');
   const Internal = require('./Internal');
   const InternalComments = require('./InternalComments');
   const Sales = require('./Sales');
   const SalesComments = require('./SalesComments');
   const SalesCredit = require('./SalesCredit');
   const SalesImages = require('./SalesImages');
   const ServicePlan = require('./ServicePlan');
   const Staff = require('./Staff');
   const StatusLog = require('./StatusLog');
   const Stock = require('./Stock');
   const StockItem = require('./StockItem');
   const StockList = require('./StockList');
   const StockSerial = require('./StockSerial');
   const Supplier = require('./Supplier');
   const TaskInternalLogs = require('./TaskInternalLogs');
   const Tickets = require('./Tickets');
   const Vendor = require('./Vendor');

   const db = {
       User,
       BcqStock,
       BoqItems,
       BoqMasterItems,
       Comments,
       Customers,
       Departments,
       Documents,
       Inquiry,
       InquiryCategory,
       InquiryCategorySub,
       InquiryComments,
       Internal,
       InternalComments,
       Sales,
       SalesComments,
       SalesCredit,
       SalesImages,
       ServicePlan,
       Staff,
       StatusLog,
       Stock,
       StockItem,
       StockList,
       StockSerial,
       Supplier,
       TaskInternalLogs,
       Tickets,
       Vendor,
       sequelize,
   };

   // Define relationships
   SalesCredit.belongsTo(Sales, { foreignKey: 'sales_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
   Sales.hasMany(SalesCredit, { foreignKey: 'sales_id' });

   module.exports = db;