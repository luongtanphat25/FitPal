DROP TABLE IF EXISTS profile CASCADE;

CREATE TABLE Profile (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date_of_birth DATE,
  height FLOAT,
  weight FLOAT,
  gender VARCHAR(20),
  fitness_level VARCHAR(20), 
  goal VARCHAR(100),          
  program_id INTEGER REFERENCES programs(id),
  timestamp TIMESTAMP DEFAULT NOW()
);
