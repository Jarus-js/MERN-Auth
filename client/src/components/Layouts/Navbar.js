import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, logout } from "../helper";
const Navbar = ({ history }) => {
  const activeLink = path => {
    if (history.location.pathname === path) {
      return { color: "#0000FF", fontWeight: "bold" };
    }
    return { color: "#000" };
  };
  return (
    <Fragment>
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <Link className="navbar-brand" to="/" style={activeLink("/")}>
          Brand
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={activeLink("/")}>
                Home
              </Link>
            </li>
            {!isAuth() && (
              <Fragment>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    style={activeLink("/register")}
                  >
                    Signup
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    style={activeLink("/login")}
                  >
                    Login
                  </Link>
                </li>
              </Fragment>
            )}
            {isAuth() && isAuth().role === "subscriber" && (
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className="nav-link"
                  style={activeLink("/dashboard")}
                >
                  {isAuth().name}
                </Link>
              </li>
            )}
            {isAuth() && isAuth().role === "admin" && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  className="nav-link"
                  style={activeLink("/admin")}
                >
                  {isAuth().name}
                </Link>
              </li>
            )}

            {isAuth() && (
              <Fragment>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      logout(() => {
                        history.push("/");
                      });
                    }}
                  >
                    Logout
                  </span>
                </li>
              </Fragment>
            )}
          </ul>
        </div>
      </nav>
    </Fragment>
  );
};

export default withRouter(Navbar);
