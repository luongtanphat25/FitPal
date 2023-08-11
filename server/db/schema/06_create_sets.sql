DROP TABLE IF EXISTS sets CASCADE;

CREATE TABLE sets (
  id SERIAL PRIMARY KEY,
  session_id integer REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  reps smallserial NOT NULL,
  resistant real NOT NULL,
  exercise_name varchar(255) NOT NULL,
  muscle_group varchar(255) NOT NULL
);