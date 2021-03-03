const knexStringcase = require('knex-stringcase');

exports.reset = async () => {
  let config;
  let shouldTry = false;
  const options = knexStringcase(config);
  const knex = require('knex')(options);
  if (
    process.env.LOCAL_DEV &&
    process.env.DB_HOST_LOCAL.startsWith('localhost')
  ) {
    shouldTry = true;
    config = {
      client: 'pg',
      connection: {
        user: process.env.DB_USER_LOCAL,
        password: process.env.DB_PASS_LOCAL,
        database: process.env.DB_NAME_LOCAL,
        host: process.env.DB_HOST_LOCAL,
      },
      migrations: {
        directory: 'db/migrations',
      },
      seeds: {
        directory: 'db/seeds/dev',
      },
    };
  } else if (!process.env.LOCAL_DEV) {
    shouldTry = true;
    config = {
      client: 'pg',
      connection: {
        user: process.env.DB_USER_HEROKU,
        password: process.env.DB_PASS_HEROKU,
        database: process.env.DB_NAME_HEROKU,
        host: process.env.DB_HOST_HEROKU,
        port: process.env.DB_PORT_HEROKU,
      },
      migrations: {
        directory: 'db/migrations',
      },
      seeds: {
        directory: 'db/seeds/live',
      },
    };
  }

  if (shouldTry) {
    try {
      await knex.migrate.rollback(null, true);
      await knex.migrate.latest();
      await knex.seed.run();

      console.log('👌 LOCAL MODE: Database rebuild succeeded.');
      return true;
    } catch (ex) {
      console.log('❌ Error resetting database: ', ex);
      return false;
    }
  }
  console.log(
    `⚠️  Did not reset database becuase you're not connected to the localdb: `,
    ex
  );
  return false;
};
