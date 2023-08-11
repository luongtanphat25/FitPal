import React from 'react';
import { useContext, useState, useEffect } from 'react';

import CardList from '../Programs/CardList';
import CreateProgram from '../Programs/CreateProgram';
import axios from 'axios';
import { programContext } from '../../contexts/ProgramProvider';

function ProgramsPage(props) {
  const [currentProfile, setCurrentProfile] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    if(props.userView){
      axios.get(`http://localhost:8080/api/profile/${window.sessionStorage.getItem('userId')}`).then((res) => {
       setCurrentProfile(res.data);
      });
    }
  }, []);

  const {allPrograms, allSearchablePrograms, userPrograms, nonUserPrograms} = useContext(programContext);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const shouldShowLink = windowWidth <= 720;

  return (
      <div className="container-fluid">
        {props.userView ? <div className="row">
          <div className="col col-12 col-md-6 col-lg-9">
            {userPrograms.length > 0 &&
            <CardList
              cardData={userPrograms}
              title="My Programs"
              path={`/programs/`}
              editable={true}
              userView={props.userView}
              currentProfile={currentProfile}
              setCurrentProfile={setCurrentProfile}
            />
            }
            <CardList
            cardData={nonUserPrograms}
            title="Public Programs"
            path={`/programs/`}
            editable={false}
            userView={props.userView}
            currentProfile={currentProfile}
            setCurrentProfile={setCurrentProfile}
          />
          </div>

          <div
            className="col col-12 col-md-6 col-lg-3 bg-dark-75 p-0"
            id="addProgram"
          >
            <CreateProgram />
          </div>
        </div>
        : 
        <CardList
          cardData={allSearchablePrograms}
          title="Programs"
          path={`/programs/`}
          editable={false}
          userView={props.userView}
        />
        }
      </div>
  );
}

export default ProgramsPage;
