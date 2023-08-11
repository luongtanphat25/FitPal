import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar-Footer/Navbar";

import Main from "./components/Pages/Main";
import Login from "./components/Login-SignUp/Login";
import LandingPage from "./components/Pages/LandingPage";
import DevTest from "./components/Pages/DevTest";

import SessionDetail from "./components/Sessions/SessionDetail";
import ExerciseLog from "./components/Exercises/ExerciseLog";
import Footer from "./components/Navbar-Footer/Footer";
import SignUp from "./components/Login-SignUp/SignUp";
import Profile from "./components/Dashboard/Profile";
import ProgramsPage from "./components/Pages/ProgramsPage";
import ChartWorkout from "./components/Dashboard/ChartWorkout";
import LogPage from "./components/Pages/LogPage";


import ProgramProvider from "./contexts/ProgramProvider";
import { userContext } from "./contexts/UserContext";

function App() {
  const { authenticated } = useContext(userContext);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login and signup routes */}
          <Route path="/login" element={authenticated ? <Main /> : <Login />} />
          <Route
            path="/signup"
            element={authenticated ? <Main /> : <SignUp />}
          />

          {/* Page Routes */}
          <Route
            path="/dashboard"
            element={authenticated ? <Main /> : <Login />}
          />
          <Route
            path="/programs"
            element={
              authenticated ? (
                <ProgramProvider>
                  <ProgramsPage userView={true} />
                </ProgramProvider>
              ) : (
                <ProgramProvider>
                  <ProgramsPage userView={false} />
                </ProgramProvider>
              )
            }
          />
          <Route
            path="/programs/log"
            element={authenticated ? <LogPage /> : <Login />}
          />
          <Route
            path="/profile/1"
            element={authenticated ? <Profile /> : <Login />}
          />
          <Route
            path="/chartworkout/4"
            element={authenticated ? <ChartWorkout /> : <Login />}
          />
          <Route
            path="/programs/:program_id/sessions/:session_id"
            element={authenticated ? <SessionDetail editable={true}/> : <Login />}
          />
          <Route
            path="/programs/:program_id/sessions/:session_id/noedit"
            element={authenticated ? <SessionDetail editable={false}/> : <Login />}
          />
          <Route
            path="/programs/1/sessions/1/exercise/1"
            element={authenticated ? <ExerciseLog /> : <Login />}
          />

          {/* Testing Routes */}
          <Route path="/test" element={<DevTest />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
export default App;
