/* eslint-disable camelcase */

const pool = require("../configs/db.config");
const express = require("express");
const router = express.Router();

// Route to handle the PUT request to /log/:workoutId
router.put("/:workoutId", async (req, res) => {
  try {
    const { reps, resistance, user_id } = req.body;
    const workoutId = req.params.workoutId; // Get the workout ID from the route parameter

    // Define the update query
    const queryString = `
      UPDATE log
      SET reps = $1, resistance = $2, user_id = $3 
      WHERE id = $4
      RETURNING *;
    `;

    // Execute the update query
    const result = await pool.query(queryString, [
      reps,
      resistance,
      user_id,
      workoutId,
    ]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Error updating data" });
  }
});
module.exports = router;
