import React from "react";
import moment from "moment";
import SliderComponent from "../Dashboard/Slider";
import Profile from "../Dashboard/Profile";
import Log from "../Dashboard/Log";
import "../../styles/Main.css";
import { ProfileProvider } from "../../contexts/ProfileContext";
import { WorkoutProvider } from "../../contexts/WorkoutContext";
import ChatGptDailySummary from "../Dashboard/ChatGptDailySummary";
import Statistics from "../Dashboard/Statistics";
import ChartSlider from "../Dashboard/ChartSlider";
const Main = () => {
  // Formatted date for display
  const currentDate = moment().format("dddd, MMMM D");

  return (
    <ProfileProvider>
      <WorkoutProvider>
        <div className="">
          {/* <TitleImage icon={'fa-solid fa-table-columns'} /> */}

          <div className="row row-cols-1 row-cols-md-2 bg-dark opacity-75">
            <div className="p-3 text-start col col-sm-12 col-md-6 col-lg-7 text-white ">
              <div className="container-fluid py-5 px-3">
                <h1 className="display-5 fw-bold text-warning mb-0">
                  Welcome User
                </h1>
                <p className="text-secondary fw-bold fs-5">{currentDate}</p>
              </div>
              <div className="p-3">
                <ChatGptDailySummary />
              </div>
            </div>

            <div
              id="profile"
              className="text-start col col-sm-12 col-md-6 col-lg-5"
            >
              <Profile />
            </div>
          </div>
          {/* Log Section */}
          <div id="log" className="log-container bg-dark">
            <Log />
          </div>
          {/* Program Schedule Section USE SLIDER OR CAROUSEL*/}
          {/* delete slider-container */}
          <div id="program-schedule" className="bg-dark opacity-75 p-5">
            <h1 className="display-5 fw-bold text-warning mb-2">
              Program Schedule
            </h1>
            <h2 className="slider-title text-white">{currentDate}</h2>
            <SliderComponent />
          </div>

          {/* Analytics Section */}
          <div
            className="analytics-container mt-0"
            style={{ backgroundColor: "#212529" }}
          >
            <h3 className="display-5 fw-bold text-warning opacity-75">
              Analytics
            </h3>

            <ChartSlider />
          </div>

          {/* Statistics */}
          <div id="statistics" className="bg-dark opacity-75 p-5">
            <h1 className="display-5 fw-bold text-warning">Statistics</h1>
            <Statistics />
          </div>
        </div>
      </WorkoutProvider>
    </ProfileProvider>
  );
};

export default Main;
