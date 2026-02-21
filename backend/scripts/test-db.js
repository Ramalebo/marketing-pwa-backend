require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sequelize, testConnection, useSqlite } = require('../config/database');

async function run() {
  console.log('\n=== Database connection test ===\n');
  try {
    await testConnection();
    const [rows] = await sequelize.query('SELECT 1 as ok');
    console.log('Query test: SELECT 1 =>', rows);
    if (!useSqlite) {
      const [tables] = await sequelize.query('SHOW TABLES');
      console.log('Tables in database:', tables.length);
      if (tables.length > 0) {
        const names = tables.map((t) => Object.values(t)[0]);
        console.log('  ', names.slice(0, 15).join(', ') + (names.length > 15 ? '...' : ''));
      }
    }
    await sequelize.close();
    console.log('\n✓ Database test passed.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n✗ Database test failed:', err.message);
    if (err.parent) console.error('  ', err.parent.message);
    process.exit(1);
  }
}

run();
