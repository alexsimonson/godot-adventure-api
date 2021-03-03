exports.up = (knex, Promise) => {
  const createQuery = `      
          CREATE TABLE auth (
              id UUID PRIMARY KEY NOT NULL,
              username TEXT NOT NULL UNIQUE,
              hash TEXT NOT NULL,
              admin BOOL NOT NULL DEFAULT FALSE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
              `;
  return knex.raw(createQuery);
};

exports.down = (knex, Promise) => {
  return knex.raw('DROP TABLE IF EXISTS auth');
};
