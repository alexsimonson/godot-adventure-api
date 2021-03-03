require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: process.env.DB_USER_LOCAL,
      password: process.env.DB_PASS_LOCAL,
      database: process.env.DB_NAME_LOCAL,
      host: process.env.DB_HOST_LOCAL,
      port: process.env.DB_PORT_LOCAL,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev',
    },
  },

  production: {
    client: 'pg',
    connection: {
      user: process.env.DB_USER_HEROKU,
      password: process.env.DB_PASS_HEROKU,
      database: process.env.DB_NAME_HEROKU,
      host: process.env.DB_HOST_HEROKU,
      port: process.env.DB_PORT_HEROKU,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev',
    },
  },
};
