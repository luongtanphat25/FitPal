import axios from 'axios';
import ProfileLogo from '../Login-SignUp/ProfileLogo';

const Navbar = () => {
  const logOut = () => {
    axios.post('http://localhost:8080/users/logout').then(() => {
      window.sessionStorage.clear();
      window.location = '/';
    });
  };

  return (
    <div>
      <nav
        className="navbar bg-dark navbar-expand-sm fixed-top"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <a
            href="/"
            className="navbar-brand p-3 text-warning"
            style={{ fontFamily: 'Pacifico', fontSize: 30 }}
          >
            FitPal
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar"
            aria-controls="navbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav me-auto my-2 my-lg-0">
              <li className="nav-item">
                <a href="/dashboard" className="nav-link">
                  Dashboard
                </a>
              </li>

              <li className="nav-item">
                <a href="/programs" className="nav-link">
                  Programs
                </a>
              </li>

              <li className="nav-item">
                <a href="/programs/log" className="nav-link">
                  Log
                </a>
              </li>
            </ul>

            {!window.sessionStorage.getItem('isAuthenticated') ? (
              <div className="d-flex gap-3 align-items-center">
                <a href="/login" className="btn btn-warning fw-bold opacity-75 text-dark">
                  Log in
                </a>
                <a href="/signup" className="btn btn-warning fw-bold opacity-75 text-dark">
                  Register
                </a>
              </div>
              
            ) : (
              <div className="d-flex gap-3 align-items-center">
                <ProfileLogo
                  email={window.sessionStorage.getItem('email')}
                />
                <button className="btn btn-warning fw-bold opacity-75 text-dark" onClick={logOut}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
