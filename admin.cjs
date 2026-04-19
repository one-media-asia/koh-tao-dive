// admin.cjs
// AdminJS + Sequelize + SQLite setup for Node.js (CommonJS)

const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const path = require('path');

AdminJS.registerAdapter(AdminJSSequelize);

// SQLite DB file in a writable directory (e.g., ./data)
const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

// Define Orders model (Booking)
const Order = sequelize.define('Order', {
  bookingId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  courseBooked: DataTypes.STRING,
  accommodation: DataTypes.STRING,
  priceFull: DataTypes.FLOAT,
  priceDeposit: DataTypes.FLOAT,
  comments: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
});

// Define Pages model
const Page = sequelize.define('Page', {
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
  content: DataTypes.TEXT,
});

// Sync models
sequelize.sync();

// AdminJS setup
const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
  resources: [
    {
      resource: Order,
      options: {
        properties: {
          bookingId: { isTitle: true },
          priceFull: { type: 'number', label: 'Full Price' },
          priceDeposit: { type: 'number', label: 'Deposit (20%)' },
          comments: { type: 'textarea' },
        },
        listProperties: ['bookingId', 'name', 'email', 'courseBooked', 'accommodation', 'priceFull', 'priceDeposit', 'status', 'comments'],
        editProperties: ['bookingId', 'name', 'email', 'courseBooked', 'accommodation', 'priceFull', 'priceDeposit', 'status', 'comments'],
        showProperties: ['bookingId', 'name', 'email', 'courseBooked', 'accommodation', 'priceFull', 'priceDeposit', 'status', 'comments'],
        properties: {
          ...this?.properties,
          status: {
            availableValues: [
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
              { value: 'cancelled', label: 'Cancelled' },
            ],
          },
        },
      },
    },
    Page
  ],
});

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    // Simple hardcoded login (change for production!)
    if (email === 'admin@example.com' && password === 'password') {
      return { email: 'admin@example.com' };
    }
    return null;
  },
  cookiePassword: 'supersecret',
});

const app = express();
app.use(adminJs.options.rootPath, router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AdminJS running at http://localhost:${PORT}${adminJs.options.rootPath}`);
});
