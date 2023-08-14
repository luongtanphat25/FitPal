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
      const formattedDate = moment(response.data.date_of_birth).format(
        "YYYY-MM-DD"
      ); // Format the date
      setProfile({ ...response.data, date_of_birth: formattedDate });
      setSavedProfile({ ...response.data, date_of_birth: formattedDate })
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
    const formattedDateOfBirth = profile.date_of_birth instanceof Date ? profile.date_of_birth.toISOString() : null;

    try {
      // Submit form data to the server and db
      const response = await axios.post("/profile", {
        user_id: userId,
        date_of_birth: formattedDateOfBirth,
        height: profile.height,
        weight: profile.weight,
        gender: profile.gender,
        fitness_level: profile.fitness_level,
        program_id: profile.program_id,
        goal: profile.goal,
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
