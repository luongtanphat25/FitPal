import React from 'react';
import WorkoutForm from '../Log/WorkoutForm.jsx';
import WorkoutHistory from '../Log/WorkoutHistory.jsx';

const Log = () => {
  return (
    <div className="log bg-dark">
      <div className="row row-sm-12 row-md-2">
        <div className="col col-sm-12 col-md-6 p-5">
          <WorkoutHistory />
        </div>
        <div className="col col-sm-12 col-md-6 p-5">
          <WorkoutForm />
        </div>
      </div>
    </div>
  );
};

export default Log;
