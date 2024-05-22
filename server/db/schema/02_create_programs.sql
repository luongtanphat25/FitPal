DROP TABLE IF EXISTS programs CASCADE;

CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  description character(255) NOT NULL
);