// backend/knexfile.js

const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'cafe_startay_dev',
    },
    migrations: { directory: './src/migrations', tableName: 'knex_migrations' },
    seeds: { directory: './src/seeds' },
    pool: { min: 2, max: 10 },
    debug: false,
  },
  test: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.TEST_DB_NAME || 'cafe_startay_test',
    },
    migrations: { directory: './src/migrations', tableName: 'knex_migrations' },
    seeds: { directory: './src/seeds' },
    pool: { min: 1, max: 2 },
    debug: false,
  },
};