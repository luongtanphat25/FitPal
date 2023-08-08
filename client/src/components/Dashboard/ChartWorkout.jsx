/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import {
  Chart,
  LinearScale,
  BarController,
  CategoryScale,
  BarElement,
} from "chart.js";
import moment from "moment";

Chart.register(LinearScale, BarController, CategoryScale, BarElement);

const ChartWorkout = ({ userId }) => {
  //state
  const [workoutData, setWorkoutData] = useState([]);
  //useref needed to fix canvas clash bug
  const chartRef = useRef(null);

  // get data from db
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/chartworkout/4`); //hard-coded change to current user
        console.log(response.data);
        setWorkoutData(response.data);
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };

    fetchData();
  }, [userId]);

  //extract and process needed data
  const processWorkoutData = () => {
    const currentDate = moment();
    //Process data for one week
    const startDate = moment(currentDate).startOf("isoWeek");
    const endDate = moment(currentDate).endOf("isoWeek");
    //Filter log data for one week
    const workoutsThisWeek = workoutData.filter((workout) => {
      const workoutDate = moment(workout.timestamp);
      return workoutDate.isBetween(startDate, endDate, null, "[]");
    });
    //
    const exercisesPerDay = new Array(7).fill(0);

    workoutsThisWeek.forEach((workout) => {
      const workoutDate = moment(workout.timestamp);
      const dayIndex = workoutDate.isoWeekday() - 1; // 0 for Monday, 1 for Tuesday, ..., 6 for Sunday
      exercisesPerDay[dayIndex]++;
    });

    return exercisesPerDay;
  };

  useEffect(() => {
    // Initialize or update the chart when the workoutData changes
    if (!chartRef.current) {
      // Create chart for the first time
      const ctx = document.getElementById("workoutChart").getContext("2d");
      ctx.canvas.height = 400;
      //Configurations for chart
      const chartConfig = {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Number of Exercises",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              data: processWorkoutData(),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 1, // Set the step size to 1 to show whole numbers on the y-axis
            },
          },
        },
      };
      chartRef.current = new Chart(ctx, chartConfig);
    } else {
      // Update the existing chart
      chartRef.current.data.datasets[0].data = processWorkoutData();
      chartRef.current.update();
    }
  }, [workoutData]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  //TODO show data on dates for whcih workouts are listed
  const currentDate = moment();
  const startDate = moment(currentDate)
    .startOf("isoWeek")
    .format("MMM D, YYYY");
  const endDate = moment(currentDate).endOf("isoWeek").format("MMM D, YYYY");

  return (
    <div className="chart-container">
      <div className="card bg-dark opacity-75 weekly-tracker-card mb-3">
        <div className="card-body">
          <h3 className="text-warning fw-bold weekly-tracker-header">
            Weekly Exercise Tracker
          </h3>
          <Slider {...sliderSettings} className="slider-container">
            <div>
              <div className="chart-wrapper">
                {/* Put the canvas inside a div with fixed width of 400px */}
                <div className="chart-container-400">
                  <canvas id="workoutChart" height="100%" width="100%" />
                </div>
              </div>
            </div>
            {/* Add more weeks here if desired */}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ChartWorkout;