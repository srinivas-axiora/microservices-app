const { Sequelize } = require('sequelize');

const sequelize = process.env.POSTGRES_URI
  ? new Sequelize(process.env.POSTGRES_URI, { dialect: 'postgres', logging: false })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || 'postgres_shipping',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
      }
    );

module.exports = sequelize;
