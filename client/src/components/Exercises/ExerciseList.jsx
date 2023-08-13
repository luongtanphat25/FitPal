import { useState, useEffect } from 'react';
import axios from 'axios';
import ExerciseItem from './ExerciseItem';
import { useParams } from 'react-router';

const MUSCLE = {
  abdominals: 'Abdominals',
  abductors: 'Abductors',
  adductors: 'Adductors',
  biceps: 'Biceps',
  calves: 'Calves',
  chest: 'Chest',
  forearms: 'Forearms',
  glutes: 'Glutes',
  hamstrings: 'Hamstrings',
  lats: 'Lats',
  lower_back: 'Lower Back',
  middle_back: 'Middle Back',
  neck: 'Neck',
  quadriceps: 'Quadriceps',
  traps: 'Traps',
  triceps: 'Triceps',
};

const ExerciseList = (props) => {
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('');
  const [exercises, setExercies] = useState([]);
  const [userExercises, setUserExercises] = useState([]);
  const { session_id } = useParams();


  useEffect(() => {
    axios
    .get(`http://localhost:8080/sets/${session_id}`)
    .then((res) => {
      
      //Set up the list of exercises from sets
      let exerciseList = [];
      for(const set of res.data.sets) {
        if(!exerciseList.map(exercise => exercise.name).includes(set.exercise_name)) {
          exerciseList.push({name: set.exercise_name})
        }
      }
      setUserExercises(exerciseList)
    });
  }, []);

  const muscleOptions = Object.entries(MUSCLE).map(
    ([muscle, description]) => (
      <option key={muscle} value={muscle}>
        {description}
      </option>
    )
  );

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMuscleChange = (event) => {
    setMuscle(event.target.value);
  };

  useEffect(() => {
    const params = {};
    if (name) {
      params.name = name;
    }
    if (muscle) {
      params.muscle = muscle;
    }
    axios
      .get(process.env.REACT_APP_EXERCISE_API_URL, {
        headers: { 'X-Api-Key': process.env.REACT_APP_EXERCISE_API_KEY },
        params: params,
      })
      .then((res) => {
        setExercies(res.data);
      });
  }, [name, muscle]);

  const exercisesListItem = exercises.map((exercise, index) => {
    return <ExerciseItem key={index} exercise={exercise} userExercises={userExercises} browseMode={props.browseMode}/>;
  });

  return (
    <div className="w-100 p-3">
      {props.browseMode ? 
        <h1 className="text-warning fw-bold text-white">Browse Exercises</h1>
        :
        <h1 className="text-warning fw-bold text-white">Add New Exercise</h1>
      }
      <div className="py-3">
        <form className="row row-cols-1 row-cols-md-2">
          <div className="col col-md-3">
            <select
                className="form-select col mb-2"
                value={muscle}
                onChange={handleMuscleChange}
              >
              <option value="">Select a muscle</option>
              {muscleOptions}
            </select>
          </div>
          <div className="col col-md-9">
            <input
              className="form-control"
              type="search"
              placeholder="type a workout name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
        </form>
      </div>

      <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 text-center">
        {exercisesListItem}
      </div>

    
    </div>
  );
};

export default ExerciseList;
