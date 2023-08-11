import {createContext, useState, useEffect, useContext} from 'react';
import {userContext} from "./UserContext";
import axios from 'axios';
// Create a Context
export const programContext = createContext();

// Create a Component wrapper from Context.Provider
export default function ProgramProvider(props) {
  // Here is our Shared State Object
  const [userPrograms, setUserPrograms] = useState([]);
  const [nonUserPrograms, setNonUserPrograms] = useState([]);
  const [allSearchablePrograms, setAllSearchablePrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
  }); 

  // ----------------CONTEXT PROVIDERS-------------------------------------//
  const { userId } = useContext(userContext);

  // Use effect to fetch program data from the server
  useEffect(() => {
    
      // Get program data and update appropriate lists
      axios.get(`http://localhost:8080/programs`).then((res) => {
        setAllPrograms(res.data.program)
        setAllSearchablePrograms(res.data.program)
        setUserPrograms(res.data.program.filter((program) => program.user_id === userId));
        setNonUserPrograms(res.data.program.filter((program) => program.user_id !== userId));
      });
  }, []);

  const setNonUserProgramsByText = (checkString) => {
    setNonUserPrograms(allPrograms.filter((program) => 
      program.user_id !== userId &&
      (program.name.toLowerCase().includes(checkString) || 
      program.description.toLowerCase().includes(checkString))

    ));
  }

  const setAllSearchableProgramsByText = (checkString) => {
    setAllSearchablePrograms(allPrograms.filter((program) => 
      (program.name.toLowerCase().includes(checkString) || 
      program.description.toLowerCase().includes(checkString))
    ));
  }

  const deleteProgram = async (programId) => {
    try {
      // Submit form data to the server
      await axios.post(`/programs/${programId}/delete`);
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const createProgram = async () => {
    if(newProgram.name && newProgram.description){
      try {
        // Submit form data to the server
        const response = await axios.post("/programs", {
          userId: window.sessionStorage.getItem('userId'),
          name: newProgram.name,
          description: newProgram.description
        });

        // Update the profile state with the newly created/updated profile data
      } catch (error) {
        console.error("Error creating/updating profile:", error);
      }
    }
  };

  const updateProgram = async (programId, programUpdate) => {
    try {
      // Submit form data to the server
      const response = await axios.post(
        `/programs/${programId}/update`,
        programUpdate
      );
      
      // Update the profile state with the newly created/updated profile data
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }


  // This list can get long with a lot of functions.  Reducer may be a better choice
  const providerData = { 
    allPrograms, 
    allSearchablePrograms,
    userPrograms, 
    nonUserPrograms, 
    deleteProgram, 
    createProgram, 
    setNewProgram, 
    updateProgram,
    setNonUserProgramsByText,
    setAllSearchableProgramsByText
   };

  // We can now use this as a component to wrap anything
  // that needs our state
  return (
    <programContext.Provider value={providerData}>
      {props.children}
    </programContext.Provider>
  );
};