import React from "react";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { programContext } from "../../contexts/ProgramProvider";

const daysOfWeek = [
  {day_val: 0, day: "Monday"},
  {day_val: 1, day: "Tuesday"},
  {day_val: 2, day: "Wednesday"},
  {day_val: 3, day: "Thursday"},
  {day_val: 4, day: "Friday"},
  {day_val: 5, day: "Saturday"},
  {day_val: 6, day: "Sunday"},
]

function ProgramListItem(props) {
  const [sessions, setSessions] = useState([]);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDay, setNewSessionDay] = useState(0);
  const [potentialDays, setPotentialDays] = useState([]);
  
  // State for when editing a program
  const [programUpdate, setProgramUpdate] = useState({
    name: props.name,
    description: props.description,
  });
  
  // Modes for edit and delete
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Toggle the class on the card when the program is the current program for the user
  const cardClass =
    props.currentProfile && props.currentProfile.program_id === props.programId
      ? "card bg-dark text-start border-warning"
      : "card bg-dark text-start";

  const navigate = useNavigate();

  // Get program functions from
  const { deleteProgram, updateProgram } = useContext(programContext);

  const setUpSessions = async () => {
    // Get the list of sessions based off of the program id
    await axios
      .get(`http://localhost:8080/sessions/program/${props.programId}`)
      .then((res) => {
        setSessions(res.data.sessions);
        setUpPotentialDays()
      });
  }

  // Set up the list of potential days to choose from
  const setUpPotentialDays = () => {
     // Update possible session days
    let newPotentialDays = daysOfWeek.filter((day) => !sessions.map(session => session.day_of_week).includes(day.day_val));
    setPotentialDays(newPotentialDays)
    if(newPotentialDays.length){
      setNewSessionDay(newPotentialDays[0].day_val)
    }
  }

  useEffect(() => {
    setUpSessions();
  }, [sessions.length]);

  const createNewSession = async (event, program_id) => {
    // prevent the default form action
    event.preventDefault();
    // check if the session name field is not blank
    if (newSessionName) {
      try {
        // Submit form data to the server
        const response = await axios.post(
          `/sessions/program/${program_id}`,
          {
            name: newSessionName,
            day_of_week: newSessionDay,
            program_id,
          }
          
        );
        setSessions([...sessions, response.data].sort((a,b) => a.day_of_week < b.day_of_week))
        setNewSessionName("");
      } catch (error) {
        console.error("Error creating session:", error);
      }
    }
  };

  // navigation for the session
  const navigateToSession = (session) => {
    if(props.editable){
      navigate(`/programs/${props.programId}/sessions/${session.id}`);
    } else {
      navigate(`/programs/${props.programId}/sessions/${session.id}/noedit`);
    }
  };

  // function to toggle edit mode
  const updateCurrentProgram = async (programId) => {
    try {
      // Submit form data to the server
      const response = await axios.post(`/profile/`, {
        ...props.currentProfile,
        program_id: programId,
      });
      props.setCurrentProfile({
        ...props.currentProfile,
        program_id: programId,
      });
      // Update the profile state with the newly created/updated profile data
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  // Delete the current program and reload the page
  const deleteAndUpdateCurrentProgram = (programId) => {
    if(props.currentProfile.program_id === programId){
      updateCurrentProgram(null);
    }
    deleteProgram(programId)
    window.location.reload();
  }

  // Set the program and clear edit mode
  const setProgramAndEditMode = () => {
    updateProgram(props.programId, programUpdate);
    setEditMode(false);
  }

  const sessionsListItem = sessions.map((session, index) => {
    return (
      <tr key={index}>
        <td className="d-flex justify-content-between" role="button" onClick={() => navigateToSession(session)}>
          <span>{daysOfWeek[session.day_of_week].day.slice(0, 3)}</span> 
          <span>{session.name}</span>
        </td>
      </tr>
    );
  });
  return (
    <div className="col my-3" style={{minWidth: '23em'}}>
      <div className={cardClass}>
        {/* Program info */}
        {editMode ? (
          <div className="card-body ">
            {/* If we are in edit mode */}
            <input
              type="text"
              value={programUpdate.name}
              className="form-control bg-secondary opacity-75 text-white mb-2"
              onChange={(e) =>
                setProgramUpdate({
                  ...programUpdate,
                  name: e.target.value,
                })
              }
            />
            <textarea
              type="text"
              value={programUpdate.description}
              className="form-control bg-secondary opacity-75 text-white"
              onChange={(e) =>
                setProgramUpdate({
                  ...programUpdate,
                  description: e.target.value,
                })
              }
            />
          </div>
        ) : (
          <div className="card-body ">
            {/* If not in edit mode */}
            <h3 className="text-warning">{programUpdate.name}</h3>
            <p className="text-white">{programUpdate.description}</p>
          </div>
        )}
        {/* Add session form */}
        {props.editable && potentialDays.length && <div className="card-body border-top border-color-white">
          <form>
            <div className="input-group flex-nowrap">
              <input
                type="text"
                className="form-control bg-secondary opacity-75 text-white"
                placeholder="Add session"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
              />
              <button
                className="input-group-text btn btn-warning"
                id="addon-wrapping"
                onClick={(e) => createNewSession(e, props.programId)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
            <div className="mb-3 pt-2">
              <select
                className="form-select"
                id="day"
                name="day"
                value={newSessionDay}
                onChange={(e) => {setNewSessionDay(e.target.value)}}
              >
                {potentialDays.map((day, index) => (
                  <option key={index} value={day.day_val}>
                    {day.day}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>}
        {/* Session list */}
        <div className="card-body d-flex justify-content-between text-white">
          <table className="table table-dark table-striped">
            <tbody>{sessionsListItem}</tbody>
          </table>
        </div>
        {props.userView && (
          <div className="d-flex justify-content-end gap-3 p-2 border-top border-color-white">
            {/* Toggle star Icon when the current program is the users selected program*/}
            {props.currentProfile &&
            props.currentProfile.program_id !== props.programId ? (
              <button
                className="btn btn-dark"
                onClick={() => updateCurrentProgram(props.programId)}
              >
                <i className="fa-regular fa-star fa-xl text-warning"></i>
              </button>
            ) : (
              <button  
                className="btn btn-dark"
                onClick={() => updateCurrentProgram(null)}
              >
                <i className="fa-solid fa-star fa-xl text-warning"></i>
              </button>
            )}
            {/* Edit - Delete */}
            {props.editable && <div>
              {editMode ? 
                <div className="border border-white rounded">
                  <button
                    className="btn btn-dark"
                    onClick={() => setProgramAndEditMode()}
                  >
                    <i className="fa-solid fa-check fa-xl text-light"></i>
                  </button> 
                   <button
                    className="btn btn-dark"
                    onClick={() => setEditMode(false)}
                  >
                    <i className="fa-regular fa-x fa-xl text-danger"></i>
                  </button> 
                </div>
                :
                
                <button
                  className="btn btn-dark"
                  onClick={() => setEditMode(true)}
                >
                  <i className="fa-regular fa-edit fa-xl text-light"></i>
                </button> 

              }
              </div>}
              {props.editable && <div>
              {(deleteMode) ? 
                <div className="border border-danger rounded">
                  <button
                    className="btn btn-dark"
                    onClick={() => deleteAndUpdateCurrentProgram(props.programId)}
                  >
                    <i className="fa-solid fa-check fa-xl text-danger"></i>
                  </button> 
                   <button
                    className="btn btn-dark"
                    onClick={() => setDeleteMode(false)}
                  >
                    <i className="fa-regular fa-x fa-xl text-white"></i>
                  </button> 
                </div>
                :
                
                <button
                  className="btn btn-dark"
                  onClick={() => setDeleteMode(true)}
                >
                  <i className="fa-regular fa-trash-can fa-xl text-danger"></i>
                </button> 

              }
              </div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgramListItem;
