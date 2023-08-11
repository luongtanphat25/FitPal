const router = require("express").Router();
const sets = require("../db/queries/sets");
const pool = require("../configs/db.config");

router.get("/:session_id", (req, res) => {
  sets
    .getSetBySessionId(req.params.session_id)
    .then((sets) => {
      res.json({ sets });
    })
    .catch((e) => {
      res.status(500).json({
        error: `error from get set by session_id and exercise_id: ${e.message}`,
      });
    });
});

router.get("/program/:program_id/day/:day_of_week", (req, res) => {
  sets
    .getSetsByProgramId(req.params.program_id, req.params.day_of_week)
    .then((sets) => {
      res.json({ sets });
    })
    .catch((e) => {
      res.status(500).json({
        error: `error from get set by session_id and exercise_id: ${e.message}`,
      });
    });
});

// Route to handle the POST request to /programs
router.post("/session/:id", async (req, res) => {
  try {
    const { set, sessionId, exerciseName, muscleGroup } = req.body;

    const insertToSetsString = `
    INSERT INTO sets (session_id, reps, resistant, exercise_name, muscle_group) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;

    // SQL to db
    const result = await pool.query(insertToSetsString, [
      sessionId,
      set.reps,
      set.resistant,
      exerciseName,
      muscleGroup
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting program data:", error);
    res.status(500).json({ error: "Error inserting program data" });
  }
});

// Route to handle the POST request to /:id/delete
router.post("/:id/delete", async (req, res) => {
  sets
    .deleteSetById(req.params.id)
    .then((sets) => {
      res.json({ sets });
    })
    .catch((e) => {
      res.status(500).json({ error: `error deleting set: ${e.message}` });
    });
});

router.get("/:session_id/:exercise_name", (req, res) => {
  sets
    .getSetsBySessionAndExercise(req.params)
    .then((sets) => {
      res.json({ sets });
    })
    .catch((e) => {
      res.send({ error: e.message });
    });
});

router.delete("/:session_id/:exercise_name", (req, res) => {
  sets
    .deleteAllSetsOfSessionAndExercise(req.params)
    .then((data) => {
      res.json({ message: "deleted" });
    })
    .catch((E) => res.json({ error: error.message }));
});

module.exports = router;
