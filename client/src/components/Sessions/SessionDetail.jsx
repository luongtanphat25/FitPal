import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SessionItem from '../Sessions/SessionItem';
import ExerciseList from '../Exercises/ExerciseList';
import ExerciseLog from '../Exercises/ExerciseLog';
import AddExerciseModal from '../Exercises/AddExerciseModal';
var moment = require('moment');

const SessionDetail = (props) => {
  const [exercises, setExercises] = useState([]);
  const [title, setTitle] = useState('');
  const [session, setCurrentSession] = useState(null);
  const [sets, setSets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editSet, setEditSet] = useState(false);
  const [selectedEx, setSelectedEx] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [logs, setLogs] = useState([]);
  const user_id = window.sessionStorage.getItem('userId');
  const [displayLog, setDisplayLog] = useState(false);
  const displayExerciseList = !displayLog;

  const { session_id } = useParams();

  const fetchSessionData = async () => {
    const sessionResponse = await axios.get(`http://localhost:8080/sessions/${session_id}`);
    setTitle(sessionResponse.data.sessions[0].name);
    setCurrentSession(sessionResponse.data.sessions[0]);

    const setsResponse = await axios.get(`http://localhost:8080/sets/${session_id}`);
    const exerciseList = setsResponse.data.sets.reduce((list, set) => {
      if (!list.some((exercise) => exercise.name === set.exercise_name)) {
        list.push({ name: set.exercise_name, muscle: set.muscle_group });
      }
      return list;
    }, []);
    setSets(setsResponse.data.sets);
    setExercises(exerciseList);

    try {
      const logResponse = await axios.get(`http://localhost:8080/log/${user_id}`);
      setLogs(logResponse.data.logs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  const onSaveSessionName = async (e) => {
    e.preventDefault();
    const data = { id: session_id, name: title };
    try {
      const response = await axios.post(`http://localhost:8080/sessions/${session_id}`, data);
      if (response.status === 200) {
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteSession = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:8080/sessions/${session_id}`);
      if (response.status === 200) {
        window.location.href = '/programs';
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeName = (e) => {
    setTitle(e.target.value);
  };

  const onEdit = (exercise) => {
    setEditSet(true);
    setSelectedEx(exercise);
  };

  const onRowSelected = (exercise) => {
    setDisplayLog(true);
    setSelectedEx(exercise);
  };

  const onAddExerciseClick = () => {
    setDisplayLog(false);
  };

  const exercisesListItem = exercises.map((exercise, index) => {
    
    const exerciseSets = sets.filter((set) => set.exercise_name === exercise.name);
    const exerciseLogs = logs.filter(
      (log) =>
        log.exercise_name === exercise.name &&
        (moment(log.timestamp).day() - 1) === session.day_of_week &&
        moment(log.timestamp).isSame(new Date(), 'week')
    );
    return (
      <SessionItem
        key={index}
        sets={exerciseSets}
        exercise={exercise}
        editable={props.editable}
        onClick={() => onEdit(exercise)}
        onRowSelected={() => onRowSelected(exercise)}
        isDone={exerciseLogs.length >= exerciseSets.length}
        exerciseLogs={exerciseLogs}
        
      />
    );
  });

  return (
    <div>
      <div className="row row-col-1 row-col-md-2">
        <div className="col col-12 col-md-6 col-xl-4 bg-dark-75 text-start py-3 px-5">
          {editMode ? (
            <form className="mb-5">
              <div className="input-group">
                <input
                  className="form-control bg-secondary text-white fs-3"
                  type="text"
                  value={title}
                  onChange={onChangeName}
                />
                <button
                  className="input-group-text btn btn-warning"
                  id="addon-wrapping"
                  onClick={onSaveSessionName}
                >
                  <i className="fa-solid fa-check fa-xl"></i>
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h1 className="display-5 pt-3 fw-bold text-white">{title}</h1>
              <div className="d-flex justify-content-between mb-5">
                {props.editable && <a
                  className="btn btn-warning"
                  href="#addExercise"
                  onClick={onAddExerciseClick}
                >
                  <i className="fa-solid fa-plus"></i> exercise
                </a>}
                {props.editable && <div className="d-flex">
                  
                  {deleteMode ?
                  <div className="border border-danger rounded"> 
                    <button className="btn btn-dark" onClick={onDeleteSession}>
                      <i className="fa-solid fa-check fa-xl text-danger"></i>
                    </button>
                    <button className="btn btn-dark" onClick={() => setDeleteMode(false)}>
                      <i className="fa-regular fa-x fa-xl text-white"></i>
                    </button>
                  </div>
                  :
                  <div>
                    <button
                    className="btn btn-dark"
                    onClick={() => setEditMode(true)}
                  >
                      <i className="fa-regular fa-pen-to-square fa-xl text-light"></i>
                    </button>
                    <button className="btn btn-dark" onClick={() => setDeleteMode(true)}>
                      <i className="fa-regular fa-trash-can fa-xl text-danger"></i>
                    </button>
                  </div>}
                </div>}
              </div>
            </div>
          )}
          <div className="row row-cols-1 ">
            {exercises.length > 0 ? (
              <table className="table table-dark table-striped table-hover">
                <tbody>{exercisesListItem}</tbody>
              </table>
            ) : (
              <p className="display-6 fw-light text-white">no exercises added yet</p>
            )}
          </div>
        </div>
        {displayExerciseList && (
          <div className="col col-12 col-md-6 col-xl-8" id="addExercise">
            <ExerciseList browseMode={!props.editable} />
          </div>
        )}
        {displayLog && (
          <div className="col col-12 col-md-6 col-xl-8 px-0">
            <ExerciseLog name={selectedEx?.name} />
          </div>
        )}
      </div>
      {editSet && <AddExerciseModal setModalDisplay={setEditSet} name={selectedEx?.name} muscle={selectedEx?.muscle}/>}
    </div>
  );
};

export default SessionDetail;
