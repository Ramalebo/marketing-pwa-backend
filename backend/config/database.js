const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use MySQL when DB_HOST is set (Render). Otherwise use SQLite (local dev). On Render: set DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT; do not set USE_SQLITE.
const hasMySql = !!process.env.DB_HOST;
const useSqlite = !hasMySql;

const sqliteStorage = path.join(__dirname, '..', 'data', 'database.sqlite');

const sequelize = useSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: sqliteStorage,
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    })
  : new Sequelize(
      process.env.DB_NAME || 'marketing_pwa',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

const dbLabel = useSqlite ? 'SQLite' : 'MySQL';

const testConnection = async () => {
  try {
    console.log(`Database mode: ${dbLabel} (USE_SQLITE=${process.env.USE_SQLITE}, DB_HOST=${process.env.DB_HOST || '(not set)'})`);
    if (useSqlite) {
      const fs = require('fs');
      const dataDir = path.dirname(sqliteStorage);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }
    await sequelize.authenticate();
    console.log(`Connected to ${dbLabel} database`);
  } catch (error) {
    console.error(`${dbLabel} connection error:`, error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection, useSqlite };