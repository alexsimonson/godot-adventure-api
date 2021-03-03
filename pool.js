require('dotenv').config(); // .env file variables are now accessible globally via process.env.variable_name
const Pool = require('pg').Pool;

//localhost pool
const pool = new Pool({
  user: process.env.DB_USER_LOCAL,
  host: process.env.DB_HOST_LOCAL,
  database: process.env.DB_NAME_LOCAL,
  password: process.env.DB_PASS_LOCAL,
  port: process.env.DB_PORT_LOCAL,
});

// heroku pool
// const pool = new Pool({
//   user: process.env.DB_USER_HEROKU,
//   host: process.env.DB_HOST_HEROKU,
//   database: process.env.DB_NAME_HEROKU,
//   password: process.env.DB_PASS_HEROKU,
//   port: process.env.DB_PORT_HEROKU
// });

module.exports = pool;
