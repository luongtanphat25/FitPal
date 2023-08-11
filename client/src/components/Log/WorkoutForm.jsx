/* eslint-disable react-hooks/exhaustive-deps */
// WorkoutForm.js
import { useEffect, useState } from "react";
import React from "react";
import { useWorkoutContext } from "../../contexts/WorkoutContext";
import "../../styles/Log.css";
import axios from "axios";

const WorkoutForm = () => {
  const {
    MUSCLE,
    muscleGroups,
    selectedMuscleGroup,
    setSelectedMuscleGroup,
    exercises,
    selectedExercise,
    selectedExerciseDescription,
    reps,
    setReps,
    weightLoad,
    setWeightLoad,
    handleMuscleGroupSelection,
    handleExerciseSelection,
    handleSubmit,
    editingWorkout,
    handleCancelEdit,
    API_KEY,
    API_URL,
    setExercises,
    setSelectedExerciseDescription,
  } = useWorkoutContext();

  const [readMore, setReadMore] = useState(false);

  useEffect(() => {
    // Use Select Muscle group as the first option in dropdown menu
    if (muscleGroups.length > 0) {
      const firstMuscleGroup = "Select Muscle Group";
      setSelectedMuscleGroup(firstMuscleGroup);
    }
  }, [muscleGroups]);

  useEffect(() => {
    // Fetch exercises from API based on the selected muscle group
    const fetchExercisesByMuscle = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { "X-Api-Key": API_KEY },
          params: { muscle: selectedMuscleGroup },
        });
        setExercises(response.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercisesByMuscle();
  }, [selectedMuscleGroup, selectedExerciseDescription, selectedExercise]);

  useEffect(() => {
    //load exercise from api response and account for any changes
    const exercise = exercises.find((ex) => ex.name === selectedExercise);
    //Dynamic display to show instructions for each exercise or null if no exercise is selected
    setSelectedExerciseDescription(exercise?.instructions || "");
  }, [selectedExercise]);

  return (
    <div className="addlog text-white bg-dark p-5 rounded">
      <h3 className="text-warning fw-bold">Log Workout</h3>
      <div>
        {/* Exercise Details Section */}
        {!editingWorkout && selectedExercise && exercises.length > 0 && (
          <div>
            {readMore && (
              <div>
                <p className="text-secondary">{selectedExerciseDescription}</p>
                <p className="text-secondary">
                  <strong>Difficulty:</strong>{" "}
                  {exercises[0].difficulty.toUpperCase()}
                </p>
                <p className="text-secondary">
                  <strong>Type:</strong> {exercises[0].type.toUpperCase()}
                </p>
                <p className="text-secondary text-end">
                  <span
                    className="badge text-bg-warning me-2 pt-1"
                    onClick={() => setReadMore(false)}
                    style={{cursor: 'pointer'}}
                  >
                    Hide Deails
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
        {editingWorkout && selectedExercise && (
          <h4 className="text-secondary">{selectedExercise}</h4>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        {!editingWorkout && (
          <div className="text-start mb-3">
            <label htmlFor="muscleGroup" className="form-label text-white">
              Muscle Group
            </label>
            <select
              id="muscleGroup"
              className="form-select btn-warning"
              value={selectedMuscleGroup}
              onChange={handleMuscleGroupSelection}
            >
              <option value="">Select Muscle Group</option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {MUSCLE[group]}
                </option>
              ))}
            </select>
          </div>
        )}
        {!editingWorkout && (
          <div className="text-start mb-3">
            <label htmlFor="exercise" className="form-label text-white">
              Exercise
            </label>
            <select
              id="exercise"
              className="form-select btn-warning"
              value={selectedExercise}
              onChange={handleExerciseSelection}
            >
              <option value="">Select Exercise</option>
              {exercises.map((exercise) => (
                <option key={exercise.name} value={exercise.name}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="text-secondary text-end">
          {!readMore && selectedExerciseDescription.length > 100 && (
            <span
              className="badge text-bg-warning me-2 pt-1"
              onClick={() => setReadMore(true)}
              style={{ cursor: 'pointer' }}
            >
              Show Details
            </span>
          )}
        </p>

        <div className="row row-cols-sm-2 pt-0">
          <div className="col">
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                Weight
              </span>
              <input
                type="number"
                id="weightLoad"
                value={weightLoad}
                onChange={(e) => setWeightLoad(e.target.value)}
                required
                min="1"
                className="form-control form-control-lg"
              />
            </div>
          </div>
          <div className="col">
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                Reps
              </span>
              <input
                type="number"
                id="reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
                min="1"
                className="form-control form-control-lg"
              />
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-warning mt-4">
            {editingWorkout ? "Update" : "Log Workout"}
          </button>
          {editingWorkout && (
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
