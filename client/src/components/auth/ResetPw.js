import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const ResetPw = ({ match }) => {
  const [value, setValue] = useState({
    name: "",
    token: "",
    newPassword: ""
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValue({ ...value, name, token });
    }
  }, []);

  const { newPassword, token,name} = value;
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
      url: `${process.env.REACT_APP_API}/api/auth/reset-password`,
      data: { newPassword, resetPasswordLink: token }
    })
      .then(response => {
        console.log("Password successfully updated", response);
        setValue({
          ...value,
          newPassword:""
        })
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
      <h2 className="text-center">Hey {name} Type Your New Password</h2>
      <form onSubmit={onSubmit} className="mt-5">
        <div className="form-group">
          <input
            className="form-control"
            type="password"
            placeholder="Type New Password"
            name="newPassword"
            value={newPassword}
            onChange={onChange}
          />
        </div>

        <button className="btn btn-primary">Request Password Reset Link</button>
      </form>
    </Fragment>
  );
};

export default ResetPw;
