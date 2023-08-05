import SessionItem from '../Sessions/SessionItem';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProgramDetail = () => {
  const [program, setProgram] = useState({});
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/programs/1`).then((res) => {
      setProgram(res.data.program);
    });

    axios
      .get(`http://localhost:8080/sessions/program/1`)
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

      <div>
        <h1 className="fw-bold text-white pt-5">Session List</h1>
        <div className="px-4 row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4  d-flex justify-content-between">
          {sessionsListItem}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
