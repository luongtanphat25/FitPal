import React from "react"
import { useContext }  from "react"
import { programContext } from '../../contexts/ProgramProvider';

const CreateProgram = () => {
  const { createProgram, setNewProgram } = useContext(programContext);

  // Function to handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProgram((prevProgram) => ({
      ...prevProgram,
      [name]: value,
    }));
  };

  return (
    <div className="px-3">
      <form id="create_program_form" className="">
        <div className="container bg-dark opacity-75 text-white rounded">
          <h1 className="display-5 pt-3 fw-bold text-white">Create Program</h1>
          <div className="text-start">
            <label htmlFor="desciption" className="form-label">
              Name
            </label>
            <input
              onChange={handleChange}
              className="form-control"
              id="name"
              name="name"
              placeholder="name"
              required
            />
          </div>

          <div className="text-start py-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              onChange={handleChange}
              className="form-control"
              id="description"
              name="description"
              placeholder="description"
              required
            />
          </div>

          <div className="d-grid pt-3">
            <button onClick={() => createProgram()} className="btn btn-warning">Create</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProgram;