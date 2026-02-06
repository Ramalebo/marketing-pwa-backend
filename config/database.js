const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const useSqlite = process.env.USE_SQLITE === 'true' || process.env.DB_DIALECT === 'sqlite';

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