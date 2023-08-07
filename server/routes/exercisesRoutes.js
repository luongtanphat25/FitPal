const router = require('express').Router();
const exercises = require('../db/queries/exercises');
const sessions = require('../db/queries/sessions');
const pool = require("../configs/db.config");

router.get('/session/:id/exercises', (req, res) => {
  exercises
    .getExercisesBySessionId(req.params.id)
    .then((exercises) => {
      res.json({ exercises });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ error: `error from get exercise by session_id: ${e.message}` });
    });
});

router.get('/session/:id', (req, res) => {
  sessions
    .getSessionById(req.params.id)
    .then((sessions) => {
      res.json({ sessions });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ error: `error from get session by session_id: ${e.message}` });
    });
});

// Route to handle the POST request to /programs
router.post("/session/:id", async(req, res) => {
  try {
    const { sets, sessionId, exerciseName } = req.body;
    console.log(req.body);
    // // see if the exercise exists in the db
    // const exercisesQuery = `
    //   SELECT * FROM exercises WHERE name = $1;
    // `;

    // // SQL to db
    // const result1 = await pool.query(exercisesQuery, [
    //   name
    // ]);
    // let exerciseId = 0;

    // // if exercise doesnt exist create it
    // if(!result1.rows.length) {
    //   const queryString = `
    //   INSERT INTO Exercises (name, difficulty, muscle)
    //   VALUES ($1, $2, $3)
    //   RETURNING *;
    //   `;

    //   // SQL to db
    //   const result = await pool.query(queryString, [
    //     name, "", muscle
    //   ]);
      
    //   const exersiceIdString = `
    //     SELECT max(id) FROM Exercises
    //   `;

    //   // SQL to db
    //    maxIdQueryResult = await pool.query(exersiceIdString);
    //    exerciseId = maxIdQueryResult.rows[0].max
    // } else { // if it does use its id
    //   exerciseId = result1.rows[0].id;
    // }

    // // create a row in the session exercise table based on results
    // const intertToSesExQueryString = `
    //   INSERT INTO sessions_exercises (session_id, exercise_id)
    //   VALUES ($1, $2)
    //   RETURNING *;
    // `;
    
    // // SQL to db
    // const result2 = await pool.query(intertToSesExQueryString, [
    //   sessionId, exerciseId]
    // );

    // Add sets to the sets table

    for(const set of sets) {
      const insertToSetsString = `
      INSERT INTO sets (session_id, reps, resistant, exercise_name) 
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `;
      
      // SQL to db
      const result3 = await pool.query(insertToSetsString, [
        sessionId, set.reps, set.weight, exerciseName ]
      );
      
    }

    res.status(201).json("sets added");
  } catch (error) {
    console.error("Error inserting program data:", error);
    res.status(500).json({ error: "Error inserting program data" });
  }
});





module.exports = router;