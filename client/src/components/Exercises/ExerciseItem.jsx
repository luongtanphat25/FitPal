import { useState } from 'react';
import AddExerciseModal from './AddExerciseModal';
import ExerciseDetailModal from './ExerciseDetailModal';

const ExerciseItem = (props) => {
  const [modalDisplay, setModalDisplay] = useState(false);
  const [exerciseDetailDisplay, setExerciseDetailDisplay] =
    useState(false);
  const exercise = props.exercise;

  const handleOnClick = () => {
    setModalDisplay(true);
  };
  const displayDetail = () => {
    setExerciseDetailDisplay(true);
  };

  return (
    <div className="col my-3">
      <div className="card bg-dark opacity-75 text-start">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-warning card-title">{exercise.name}</h6>
            <h6 className="card-subtitle text-secondary">
              {exercise.muscle}
            </h6>
          </div>
          {!props.browseMode && (!props.userExercises
            .map((exercise) => exercise.name)
            .includes(exercise.name) ? (
            <button className="btn btn-dark" onClick={handleOnClick}>
              <i className="fa-solid fa-plus fa-xs"></i>
            </button>
          ) : (
            <button className="btn btn-dark" disabled>
              <i className="fa-solid fa-check text-info"></i>
            </button>
          ))}
        </div>
        <div className="card-body border-top border-white">
          <p className="card-text text-white">
            {exercise.instructions.substring(0, 100) + ' ...' ||
              'No instruction added yet.'}
          </p>
          <button type="button" className="btn btn-link text-info px-0" onClick={displayDetail}>
            more details
          </button>
        </div>
        {props.sets && (
          <div className="card-footer d-flex flex-wrap justify-content-between gap-2">
            {props.sets
              .filter((set) => set.exercise_name === exercise.name)
              .map((set) => (
                <span className="badge text-bg-light">
                  {set.resistant}lbs/{set.reps}
                </span>
              ))}
          </div>
        )}
      </div>
      {/* Create the excercise modal */}
      {modalDisplay && (
        <AddExerciseModal
          name={exercise.name}
          setModalDisplay={setModalDisplay}
          muscle={exercise.muscle}
        />
      )}

      {exerciseDetailDisplay &&(<ExerciseDetailModal exercise={exercise} setExerciseDetailDisplay={setExerciseDetailDisplay} />)}
    </div>
  );
};

export default ExerciseItem;
