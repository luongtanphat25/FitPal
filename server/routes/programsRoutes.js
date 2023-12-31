const router = require('express').Router();
const programs = require('../db/queries/programs');
const pool = require("../configs/db.config");

router.get('/', (req, res) => {
  programs
    .getAllPrograms()
    .then((program) => {
      res.json({ program });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ error: `error from get all programs: ${e.message}` });
    });
});

router.get('/users/:id', (req, res) => {
  programs
    .getAllProgramsByUserId(req.params.id)
    .then((program) => {
      res.json({ program });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ error: `error from get all programs: ${e.message}` });
    });
});

router.get('/:id', (req, res) => {
  programs
    .getProgramById(req.params.id)
    .then((program) => {
      res.json({ program });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ error: `error from get program by id: ${e.message}` });
    });
});

// Route to handle the POST request to /programs
router.post("/", async(req, res) => {
  try {
    const { name, description, user_id } = req.body;

    // queryString
    const queryString = `
      INSERT INTO Programs (user_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    // SQL to db
    const result = await pool.query(queryString, [
      user_id, name, description
    ]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting program data:", error);
    res.status(500).json({ error: "Error inserting program data" });
  }
});

// Route to handle the POST request to /programs/:id/delete
router.post('/:id/delete', (req, res) => {
  programs
    .deleteProgramById(req.params.id)
    .then((program) => {
      res.json({ program });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ error: `error deleting program by id: ${e.message}` });
    });
});

// Route to handle the POST request to /programs/:id/delete
router.post('/:id/update', async(req, res) => {
  try {
    const id = req.params.id
    const { name, description } = req.body;
    // queryString
    const queryString = `
      UPDATE Programs 
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *;
    `;
    console.log(name, description, id)
    // SQL to db
    const result = await pool.query(queryString, [
      name, description, id
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting program data:", error);
    res.status(500).json({ error: "Error inserting program data" });
  }
});

module.exports = router;
