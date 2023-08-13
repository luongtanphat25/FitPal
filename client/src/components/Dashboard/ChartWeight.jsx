import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, PointElement, LineElement } from "chart.js";
import "chart.js/auto"; // Import the auto package
import moment from "moment";
import 'chartjs-adapter-moment'
import { useProfileContext } from "../../contexts/ProfileContext";

const WeightChart = ({ userId, selectedInterval }) => {
  const { profileHistory, fetchHistoricalProfileData } = useProfileContext();
  Chart.register(PointElement, LineElement);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricalProfileData();
  }, [userId, selectedInterval]);

  useEffect(() => {
    if (profileHistory) {
      setLoading(false);
    }
  }, [profileHistory]);

  // Process profileHistory data into separate arrays for x and y values
  const xValues = profileHistory
    ? profileHistory.map((entry) => moment(entry.day).toDate())
    : [];
  const yValues = profileHistory
    ? profileHistory.map((entry) => entry.weights[0])
    : [];

  const chartData = {
    labels: xValues.map((xValue) => xValue.toISOString().split("T")[0]),
    datasets: [
      {
        label: "Average Weight",
        data: yValues,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        pointRadius: 5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Weight",
        },
      },
    },
  };

  return loading ? <div>Loading...</div> : <Line data={chartData} options={options} />;
};

export default WeightChart;