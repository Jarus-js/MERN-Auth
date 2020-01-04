import React, { Fragment, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const ForgotPw = ({ history }) => {
  const [value, setValue] = useState({
    email: ""
  });
  const { email } = value;
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
      url: `${process.env.REACT_APP_API}/api/auth/forget-password`,
      data: { email }
    })
      .then(response => {
        console.log("pw reset email send", response);
        toast.success(response.data.message);
      })
      .catch(err => {
        console.log("Login error", err);
        toast.error(err.response.data.error);
      });
  };
  return (
    <Fragment>
      <ToastContainer />
      <h2 className="text-center">Forget Password</h2>
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

        <button className="btn btn-primary">Request Password Reset Link</button>
      </form>
    </Fragment>
  );
};

export default ForgotPw;
