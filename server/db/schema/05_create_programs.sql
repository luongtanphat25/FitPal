DROP TABLE IF EXISTS programs CASCADE;

CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
  description character(255) NOT NULL
);