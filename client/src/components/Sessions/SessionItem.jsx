import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { LinearProgress } from '@mui/material';

const SessionItem = (props) => {
  const [deleteMode, setDeleteMode] = useState();
  const isCompleted = props.isDone;
  const deleteItem = async () => {
    for (const set of props.sets) {
      if (set.exercise_name === props.exercise.name) {
        try {
          // Submit form data to the server
          await axios.post(`/sets/${set.id}/delete`);
          // Update the profile state with the newly created/updated profile data
        } catch (error) {
          console.error('Error creating session:', error);
        }
      }
    }
    window.location.reload();
  };

  const getCompletionVal = () => {
    if(props.exerciseLogs.length > props.sets.length) {
      return 100;
    } else {
      return props.exerciseLogs.length / props.sets.length * 100
    }
    
  }

  const setList = props.sets
    .filter((set) => set.exercise_name === props.exercise.name)
    .map((set) => (
      <span className="badge text-bg-light" key={set.id}>
        {set.resistant}lbs/{set.reps}
      </span>
    ));

  const logList = props.exerciseLogs.map((exercise, index) =>
      <span className="badge text-bg-warning" key={index}>
        {exercise.resistance}lbs/{exercise.reps}
      </span>
    )

  return (
    <tr>
      {!deleteMode ? (
        <td
          role="button"
          onClick={props.onRowSelected}
        >
          <div className="p-3 d-flex justify-content-between">
          <div>
            <div className="d-flex gap-3">
              <h6 className="text-warning">{props.exercise.name}</h6>
              {isCompleted && (
                <i className="fa-solid fa-check text-success"></i>
              )}
              
            </div>
            <div className="d-flex gap-2 flex-wrap">{setList}</div>
            <div className="d-flex gap-2 flex-wrap pt-2">{logList}</div>
          </div>
          {/* {add edit - delete button} */}
          {props.editable && (
            <div>
              <div className="d-flex align-self-center">
                <button className="btn" onClick={props.onClick}>
                  <i className="fa-regular fa-pen-to-square fa-xl text-light"></i>
                </button>
                <button
                  className="btn"
                  onClick={() => setDeleteMode(true)}
                >
                  <i className="fa-regular fa-trash-can fa-xl text-danger"></i>
                </button>
              </div>
            </div>
          )}
          </div>
          <div className="w-100">
            <LinearProgress color="success" variant="determinate" value={getCompletionVal()}sx={{ width: "100%"}}/>
          </div>
          
        </td>
      ) : (
        <td role="button" className="p-3 d-flex justify-content-between">
          <div>
            <h6 className="">Deleting {props.exercise.name}</h6>
          </div>
          {/* {add edit - delete button} */}
          <div className="align-self-center border border-danger rounded">
            <button className="btn" onClick={() => deleteItem()}>
              <i className="fa-solid fa-check fa-xl text-danger"></i>
            </button>
            <button className="btn" onClick={() => setDeleteMode(false)}>
              <i className="fa-solid fa-x fa-xl text-light"></i>
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default SessionItem;
