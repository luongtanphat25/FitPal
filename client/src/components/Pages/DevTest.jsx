import React from "react";
import { useState, useEffect} from "react";

import TitleImage from "../TitleCards/TitleImage";
import CardList from "../Programs/CardList";
import CreateProgram from "../Programs/CreateProgram";
import axios from "axios";
import WorkoutHistoryCopy from "../Log/WorkoutHistoryCopy";
import { WorkoutProvider } from "../../contexts/WorkoutContext";

 function DevTest(){

  return (
    <div>
      <WorkoutProvider>
        <WorkoutHistoryCopy/>
      </WorkoutProvider>
    </div>
  )
}

export default DevTest;