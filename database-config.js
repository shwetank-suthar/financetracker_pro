// Database Configuration for FinanceTracker Pro
// Update these settings to match your local PostgreSQL setup

const databaseConfig = {
  // PostgreSQL connection settings
  host: 'localhost',
  port: 5432,
  database: 'financetracker',
  username: 'postgres', // Change to your PostgreSQL username
  password: 'your_password', // Change to your PostgreSQL password
  
  // Connection pool settings
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
  
  // SSL settings (set to true for production)
  ssl: false,
  
  // Logging
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Timezone
  timezone: '+05:30', // IST timezone
  
  // Dialect
  dialect: 'postgres',
  
  // Additional options
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'production') {
  databaseConfig.ssl = true;
  databaseConfig.logging = false;
  // Add production-specific settings here
}

if (process.env.NODE_ENV === 'test') {
  databaseConfig.database = 'financetracker_test';
  databaseConfig.logging = false;
}

// Export configuration
module.exports = databaseConfig;

// Example usage with different ORMs:

// 1. For Sequelize ORM:
/*
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    pool: databaseConfig.pool,
    logging: databaseConfig.logging,
    ssl: databaseConfig.ssl,
    timezone: databaseConfig.timezone,
    define: databaseConfig.define,
  }
);
*/

// 2. For Knex.js:
/*
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    ssl: databaseConfig.ssl,
  },
  pool: databaseConfig.pool,
});
*/

// 3. For raw PostgreSQL (pg library):
/*
const { Pool } = require('pg');
const pool = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  ssl: databaseConfig.ssl,
  max: databaseConfig.pool.max,
  min: databaseConfig.pool.min,
  idleTimeoutMillis: databaseConfig.pool.idleTimeoutMillis,
  connectionTimeoutMillis: databaseConfig.pool.acquireTimeoutMillis,
});
*/
