import React from 'react';
import WorkoutForm from '../Log/WorkoutForm.jsx';
import WorkoutHistory from '../Log/WorkoutHistory.jsx';

const Log = () => {
  return (
    <div className="log bg-dark">
      <h3 className="display-5 fw-bold text-warning opacity-75 m-0 py-3">
        Workout
      </h3>
      <div className="row row-sm-12 row-md-2">
        <div className="col col-sm-12 col-md-6">
          <WorkoutHistory />
        </div>
        <div className="col col-sm-12 col-md-6">
          <WorkoutForm />
        </div>
      </div>
    </div>
  );
};

export default Log;
