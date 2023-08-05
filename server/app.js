/* eslint-disable camelcase */
require('dotenv').config();
const { ENVIROMENT, PORT } = process.env;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const pool = require('./configs/db.config');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//routes import
const progamsRoutes = require('./routes/programsRoutes');
const sessionsRoutes = require('./routes/sessionsRoutes');
const exercisesRoutes = require('./routes/exercisesRoutes');

const app = express();
// middleware setup
app.use(morgan(ENVIROMENT));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/programs', progamsRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/exercises', exercisesRoutes);

//-------------------------------LOG----------------------------------//
// Route to handle the POST request to /log
app.post('/log', async (req, res) => {
  try {
    const {
      exercise_name,
      reps,
      resistance,
      user_id,
      session_id,
      exercise_id,
    } = req.body;

    // queryString
    const queryString = `
      INSERT INTO log (exercise_name, reps, resistance, user_id, session_id, exercise_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    // SQL to db
    const result = await pool.query(queryString, [
      exercise_name,
      reps,
      resistance,
      user_id,
      session_id,
      exercise_id,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
  }
});

//**********get request still needed */
//---------------------------Profile------------------------------------------//

app.post('/profile', async (req, res) => {
  try {
    const { user_id, age, height, weight, gender } = req.body;

    // queryString
    const queryString = `
      INSERT INTO Profile (user_id, age, height, weight, gender)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    // SQL to db
    const result = await pool.query(queryString, [
      user_id,
      age,
      height,
      weight,
      gender,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting profile data:', error);
    res.status(500).json({ error: 'Error inserting profile data' });
  }
});

////////////////////////////////////////////////////////////////////////////////

app.get('/profile/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // queryString
    const queryString = `
      SELECT * FROM Profile
      WHERE user_id = $1;
    `;

    // SQL to db
    const result = await pool.query(queryString, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Error fetching profile data' });
  }
});
//---------------------------------------------------------------------------//

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
