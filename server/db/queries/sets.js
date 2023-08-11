const db = require('../../configs/db.config');

const getSetBySessionId = (session_id) => {
  const url = `
    SELECT * FROM sets
    WHERE session_id = $1;
  `;
  return db.query(url, [session_id]).then((data) => {
    return data.rows;
  });
};

const deleteSetById = (id) => {
  return db.query('DELETE FROM sets WHERE id = $1;', [id]).then((data) => {
    return data.rows;
  });
};

const getSetsByProgramId = (program_id, day_of_week) => {
  const url = `
    SELECT sets.exercise_name AS name, 
          sessions.day_of_week AS day_of_week, 
          sessions.id AS session_id,
          programs.id AS program_id, 
          programs.user_id AS user_id, 
          sets.muscle_group AS muscle_group,
          sets.resistant AS resistant, 
          sets.reps AS reps 
    FROM sets
    JOIN sessions ON sets.session_id = sessions.id
    JOIN programs ON programs.id = sessions.program_id
    WHERE programs.id = $1 AND sessions.day_of_week = $2;
  `;
  return db.query(url, [program_id, day_of_week]).then((data) => {
    return data.rows;
  });
}; 

const getSetsBySessionAndExercise = (data) => {
  const queryString = `
    SELECT * FROM sets
    WHERE session_id = $1 AND exercise_name = $2;
  `;
  const { session_id, exercise_name } = data;
  return db
    .query(queryString, [session_id, exercise_name])
    .then((data) => {
      if (!data) {
        return 'Error of getting set';
      }
      return data.rows;
    })
    .catch((e) => console.log(`Error from getting set: ${e.message}`));
};

const deleteAllSetsOfSessionAndExercise = (data) => {
  const queryString = `
    DELETE FROM sets
    WHERE session_id = $1 AND exercise_name = $2;
  `;
  const { session_id, exercise_name } = data;
  return db
    .query(queryString, [session_id, exercise_name])
    .then((data) => {
      if (!data) {
        return 'Error of deleting sets for this exercise of this sesstion';
      }
      return data.rows;
    })
    .catch((e) => console.log(`Error from getting set: ${e.message}`));
};
module.exports = {
  getSetBySessionId,
  getSetsByProgramId,
  deleteSetById,
  getSetsBySessionAndExercise,
  deleteAllSetsOfSessionAndExercise
};