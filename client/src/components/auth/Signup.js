import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth } from "../helper";

const Signup = () => {
  //console.log("signup", props);
  const [value, setValue] = useState({
    name: "",
    email: "",
    password: ""
  });
  const { name, email, password, confirmPass } = value;
  const onChange = e => {
    setValue({
      //form ma jj change vako xa state ma update garxa
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = e => {
    e.preventDefault();

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/api/auth/register`,
      data: { name, email, password }
    })
      .then(response => {
        console.log("Register success", response);
        setValue({
          ...value,
          name: "",
          email: "",
          password: ""
        });
        toast.success(response.data.message);
      })
      .catch(err => {
        console.log("Register error", err.response.data);
        toast.error(err.response.data.error);
      });
  };
  return (
    <Fragment>
      <ToastContainer />
      {isAuth() ? <Redirect to="/" /> : null}
      <form onSubmit={onSubmit} className="mt-5">
        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>

        <button type="submit" className="btn btn-primary m-2">
          Register
        </button>
        <Link to="/forgetPassword" className="btn btn-outline-primary">
          Forgot Password ?
        </Link>
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </Fragment>
  );
};

export default Signup;
