import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { authenticate, isAuth } from "../helper";
import Google from "./Google";
const Login = ({ history }) => {
  const [value, setValue] = useState({
    name: "",
    email: "",
    password: ""
  });
  const { email, password } = value;
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
      url: `${process.env.REACT_APP_API}/api/auth/login`,
      data: { email, password }
    })
      .then(response => {
        console.log("Login success", response);
        authenticate(response, () => {
          setValue({
            ...value,
            name: "",
            email: "",
            password: ""
          });
          //toast.success(`Hey${response.data.user.name},Welcome back`);
          isAuth() && isAuth().role === "admin"
            ? history.push("/admin")
            : history.push("/dashboard");
        });
      })
      .catch(err => {
        console.log("Login error", err);
        toast.error(err.response.data.error);
      });
  };
  return (
    <Fragment>
      <ToastContainer />
      <Google />
      {isAuth() ? <Redirect to="/" /> : null}
      <form onSubmit={onSubmit} className="mt-5">
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
        <button className="btn btn-primary">Login</button>{" "}
        <Link to="/forgetPassword" className="btn btn-outline-primary">
          Forgot Password ?
        </Link>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </Fragment>
  );
};

export default Login;
