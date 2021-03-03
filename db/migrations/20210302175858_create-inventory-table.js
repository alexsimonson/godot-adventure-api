exports.up = (knex, Promise) => {
  const createQuery = `      
              CREATE TABLE inventory (
                  id UUID PRIMARY KEY NOT NULL,
                  user_id UUID NOT NULL,
                  test_inventory TEXT NOT NULL, 
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );
                  `;
  return knex.raw(createQuery);
};

exports.down = (knex, Promise) => {
  return knex.raw('DROP TABLE IF EXISTS inventory');
};
