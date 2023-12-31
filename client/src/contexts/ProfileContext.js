/* eslint-disable react-hooks/exhaustive-deps */
//State
import React, { createContext, useContext, useState, useEffect } from "react";
import { userContext } from "./UserContext";
import axios from "axios";
import moment from "moment";

const ProfileContext = createContext();
export const useProfileContext = () => {
  return useContext(ProfileContext);
};

export function ProfileProvider({ children }) {
  // ----------------CONTEXT PROVIDERS-------------------------------------//
  const { userId } = useContext(userContext);

  //------------------------STATES------------------------------------------///
  const [profile, setProfile] = useState({
    date_of_birth: "Not Set",
    height: null,
    weight: null,
    gender: "Not Selected",
    fitness_level: "Not Selected",
    goal: "Not Set",
    program_id: null,
    name: null, //program name
  });
  const [savedProfile, setSavedProfile] = useState();
  const [editing, setEditing] = useState(false);

  const [profileHistory, setProfileHistory] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState("7d");
  //------------------------------------------------------------------------//
  //---------------------FUNCTIONS---------------------------------------// 
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/profile/${userId}`);
      setProfile(response.data);
      setSavedProfile(response.data)
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  //--------------------------------------------------------------------//
  const fetchHistoricalProfileData = async () => {
    try {
      const response = await axios.get(
        `/api/profile/${userId}/${selectedInterval}`
      );
      setProfileHistory(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchHistoricalProfileData();
  }, [userId, selectedInterval]);
  //--------------------------------------------------------------------//
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Gather form values from the profile state
    const formData = {
      date_of_birth: profile.date_of_birth,
      height: profile.height,
      weight: profile.weight,
      gender: profile.gender,
      fitness_level: profile.fitness_level,
      program_id: profile.program_id,
      goal: profile.goal,
    };
  
    try {
      // Submit form data to the server and db
      const response = await axios.post("/profile", {
        user_id: userId,
        ...formData,
      });
  
      // Update the profile state with the newly created/updated profile data
      setProfile(response.data);
      setSavedProfile(response.data);
      setEditing(false); // Hide the form after submitting
      fetchProfile();
    } catch (error) {
      console.error("Error creating/updating profile:", error);
    }
  };
  

  //--------------------------------------------------------------------//

  // Function to handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };
  //--------------------------------------------------------------------//

  const handleEdit = () => {
    setEditing(true); // Show the form in editing mode
  };
  //--------------------------------------------------------------------//

  const handleCancel = () => {
    setProfile(savedProfile);
    setEditing(false); // Hide the form
  };
  //--------------------------------------------------------------------//
  //calculate current age
  const calculatedAge = profile.date_of_birth
    ? moment().diff(moment(profile.date_of_birth), "years")
    : null;
  //--------------------------------------------------------------------//

  // on submit

  const contextValues = {
    profile,
    setProfile,
    savedProfile,
    editing,
    setEditing,

    fetchProfile,
    handleSubmit,
    handleCancel,
    handleChange,
    handleEdit,
    calculatedAge,

    profileHistory,
    setProfileHistory,
    selectedInterval,
    setSelectedInterval,
    fetchHistoricalProfileData,
  };

  return (
    <ProfileContext.Provider value={contextValues}>
      {children}
    </ProfileContext.Provider>
  );
}
