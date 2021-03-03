const knex = require('knex');
const knexStringcase = require('knex-stringcase');

const config = {
  client: 'pg',
  connection: {
    user: process.env.DB_USER_LOCAL,
    password: process.env.DB_PASS_LOCAL,
    database: process.env.DB_NAME_LOCAL,
    host: process.env.DB_HOST_LOCAL,
    // host: process.env.LOCAL_DEV ? process.env.DB_HOST : `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  },
};

const options = knexStringcase(config);
const db = knex(options);

module.exports = db;
