import SessionItem from '../Sessions/SessionItem';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CreateSession from '../Sessions/CreateSession';
//import sessions from '../../mocks/sessionData';

const ProgramDetail = () => {
  const [program, setProgram] = useState({});
  const [sessions, setSessions] = useState([]);

  const { program_id } = useParams();

  //const currentSessions = sessions.filter((session) => session.program_id === Number(program_id))

  useEffect(() => {
    axios
      .get(`http://localhost:8080/programs/${program_id}`)
      .then((res) => {
        setProgram(res.data.program);
      });

    axios
      .get(`http://localhost:8080/sessions/program/${program_id}`)
      .then((res) => {
        setSessions(res.data.sessions);
      });
  }, []);

  const sessionsListItem = sessions.map((session) => {
    return <SessionItem key={session.id} session={session} />;
  });

  return (
    <div>
      <div className="p-3 text-start bg-dark opacity-75">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold text-warning">
            {program.name}
          </h1>
          <p className="col-md-8 fs-4 text-white">{program.description}</p>
        </div>
      </div>
      {/* <CardList cardData={currentSessions} title="Sessions" path={`/programs/${program_id}/sessions/`}/> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col col-12 col-md-6 col-lg-7 col-xl-8">
            <h1 className="fw-bold text-white pt-5">Session List</h1>
            <div className="px-4 row row-cols-1 row-cols-lg-2 row-cols-xl-3">
              {sessionsListItem}
            </div>
          </div>

          <div
            className="col col-12 col-md-6 col-lg-5 col-xl-4 bg-dark p-0 align-self-stretch"
            style={{ minHeight: '100vh' }}
          >
            <CreateSession />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
