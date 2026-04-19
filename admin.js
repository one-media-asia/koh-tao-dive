// admin.js
// AdminJS + Sequelize + SQLite setup for Node.js

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

// Define Orders model
const Order = sequelize.define('Order', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  status: DataTypes.STRING,
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
  resources: [Order, Page],
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
