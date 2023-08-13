/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddSet from './AddSet';
import '../../styles/Modals.css';
import { useParams } from 'react-router-dom';

const MAX_SETS = 8;

const AddExerciseModal = (props) => {

  const [sets, setSets] = useState([]);
  const { session_id } = useParams();
  useEffect(() => {
    console.log(props)
  }, [])
  
  useEffect(() => {
    
    const fetchSets = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/sets/${session_id}/${props.name}`);
        if (!res.error) {
          const fetchedSets = res.data.sets;
          if (fetchedSets.length === 0) {
            setSets([{ id: 0, reps: 10, resistant: 5 }]);
          } else {
            setSets(fetchedSets);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSets();
  }, [session_id, props.name]);


  const closeModal = (e) => {
    e.preventDefault();
    props.setModalDisplay(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.delete(`http://localhost:8080/sets/${session_id}/${props.name}`);
      for (const set of sets) {
        await axios.post(`/sets/session/${session_id}`, {
          sessionId: session_id,
          set,
          exerciseName: props.name,
          muscleGroup: props.muscle
        });
      }
      window.location.reload(true);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const addSet = (e) => {
    e.preventDefault();
    if (sets.length < MAX_SETS) {
      setSets((prev) => [...prev, { id: sets.length, resistant: 5, reps: 10 }]);
    }
  };

  const removeSet = (e) => {
    e.preventDefault();
    if (sets.length > 1) {
      setSets((prev) => [...prev.slice(0, sets.length - 1)]);
    }
  };

  const updateSetInSets = (updatedSet) => {
    const updatedSets = sets.map((set) => (set.id === updatedSet.id ? updatedSet : set));
    setSets(updatedSets);
  };

  

  return (
    <div>
      {/* Modal background and foreground elements */}
      <div className="modal-background"></div>
      <div className="modal-foreground position-fixed top-50 start-50 translate-middle  col col-11 col-md-7 col-xl-5 border border-warning rounded-3">
        <div className="container bg-dark text-white rounded p-5">
          {/* Modal content */}
          <div className="d-flex justify-content-between">
            <h3 className="text-warning fw-bold">{props.name}</h3>
            <button className="btn btn-dark end-0" onClick={closeModal}>
              <i className="fa-solid fa-x text-warning"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Sets section */}
            <div className="text-start">
              {sets.map((set) => (
                <AddSet key={set.id} set={set} id={set.id} updateSetInSets={updateSetInSets} />
              ))}
              <div className="d-flex justify-content-between gap-3 mt-3">
                <button className={
                    sets.length === MAX_SETS
                      ? 'btn btn-secondary flex-fill'
                      : 'btn btn-light flex-fill'
                  } onClick={addSet}>
                  <i className="fa-solid fa-plus fa-xs"></i>
                </button>
                <button
                  className={
                    sets.length === 1
                      ? 'btn btn-secondary flex-fill'
                      : 'btn btn-light flex-fill'
                  }
                  onClick={removeSet}
                  disabled={sets.length === 1}
                >
                  <i className="fa-solid fa-minus fa-xs"></i>
                </button>
              </div>
            </div>
            {/* Save button */}
            <div className="d-grid pt-3">
              <button type="submit" className="btn btn-warning">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExerciseModal;
