/* eslint-disable react-hooks/exhaustive-deps */
// WorkoutForm.js
import { useEffect, useState } from "react";
import React from "react";
import { useWorkoutContext } from "../../contexts/WorkoutContext";
import "../../styles/Log.css";
import { Container, TextField, Autocomplete } from "@mui/material";

import ExerciseDetailModal from "../Exercises/ExerciseDetailModal";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const WorkoutForm = () => {
  const {
    MUSCLE,
    selectedMuscleGroup,
    setSelectedMuscleGroup,
    exercises,
    selectedExercise,
    reps,
    setReps,
    weightLoad,
    setWeightLoad,
    handleExerciseSelection,
    handleSubmit,
    editingWorkout,
    handleCancelEdit,
    fetchExercises,
  } = useWorkoutContext();

  const [modalDisplay, setModalDisplay] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    fetchExercises();
  }, [selectedMuscleGroup, selectedExercise]);

  return (
    <div className="addlog text-white bg-dark-50 p-5 rounded pt-3">
      <h3 className="text-warning fw-bold opacity-75 pb-3 m-0">
        Log Workout
      </h3>
      <div>
        {/* Exercise Details Section */}
        {!editingWorkout && selectedExercise && exercises.length > 0 && (
          <div></div>
        )}
        {editingWorkout && selectedExercise && (
          <h4 className="text-secondary">{selectedExercise}</h4>
        )}
      </div>
      <div
        className="
        m-0 mt-0 mb-1 pt-1 pb-4 border bg-dark border-secondary rounded flex-column border-3" 
      >
        <ThemeProvider theme={darkTheme}>
          <Container maxWidth="mg">
            <form onSubmit={handleSubmit}>
              {!editingWorkout && (
                <div className="text-start mb-3 mt-4">
                  <Autocomplete
                    id="muscleGroup"
                    options={Object.values(MUSCLE).map(
                      (muscle) =>
                        muscle.charAt(0).toUpperCase() + muscle.slice(1)
                    )}
                    value={selectedMuscleGroup || ""}
                    onChange={(_, newValue) =>
                      setSelectedMuscleGroup(
                        newValue === "Select Muscle Group" ? null : newValue
                      )
                    }
                    getOptionLabel={(group) => group || "Select Muscle Group"}
                    isOptionEqualToValue={(option, value) => option === value}
                    fullWidth
                    sx={{
                      boxShadow: 1,
                      borderRadius: 2,
                      p: 0,
                      minWidth: 100,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Muscle Group"
                        variant="outlined"
                        placeholder="Select Muscle Group"
                        sx={{
                          color: "white",
                          borderColor: "#ffc107",
                          bgcolor: "rgba(52, 58, 64, 0.75)",
                        }}
                      />
                    )}
                  />
                </div>
              )}
              {!editingWorkout && (
                <div className="text-start mb-3">
                  <Autocomplete
                    id="exercise"
                    options={exercises}
                    value={selectedExercise || ""}
                    onChange={(_, newValue) =>
                      handleExerciseSelection({ target: { value: newValue } })
                    }
                    getOptionLabel={(exercises) =>
                      exercises.name || "Select Exercise"
                    }
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      p: 0,
                      minWidth: 100,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Exercise"
                        variant="outlined"
                        placeholder="Select Exercise"
                        sx={{
                          color: "white",
                          borderColor: "#ffc107",
                          bgcolor: "rgba(52, 58, 64, 0.75)",
                        }}
                      />
                    )}
                  />
                </div>
              )}
              {!editingWorkout && selectedExercise && exercises.length > 0 && (
                <p className="text-secondary text-end">
                  {selectedExercise && (
                    <span
                      className="badge text-bg-warning me-2 pt-1 opacity-75"
                      onClick={() => setModalDisplay(true)}
                      style={{ cursor: "pointer" }}
                    >
                      Show Details
                    </span>
                  )}
                </p>
              )}
              <div className="row row-cols-sm-2 pt-0">
                <div className="col">
                  <div className="input-group flex-nowrap">
                    <span
                      className="input-group-text bg-dark opacity-75 text-warning fw-bold border-secondary border-3"
                      id="addon-wrapping"
                    >
                      Weight
                    </span>
                    <input
                      type="number"
                      id="weightLoad"
                      value={weightLoad}
                      onChange={(e) => setWeightLoad(e.target.value)}
                      className="form-control form-control-lg text-white  border-secondary border-3 bg-dark opacity-75"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group flex-nowrap">
                    <span
                      className="input-group-text bg-dark opacity-75 text-warning fw-bold border-secondary border-3"
                      id="addon-wrapping"
                    >
                      Reps
                    </span>
                    <input
                      type="number"
                      id="reps"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      required
                      min="1"
                      className="form-control form-control-lg text-white  border-secondary border-3 bg-dark opacity-75"
                    />
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-warning mt-4 text-dark fw-bold opacity-75"
                >
                  {editingWorkout ? "Update" : "Log Workout"}
                </button>
                {editingWorkout && (
                  <button
                    type="button"
                    className="btn btn-secondary mt-2 fw-bold opacity-75"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </Container>
        </ThemeProvider>
      </div>
      {modalDisplay && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          setExerciseDetailDisplay={setModalDisplay}
        />
      )}
    </div>
  );
};

export default WorkoutForm;
