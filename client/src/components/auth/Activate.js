import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import jwt from "jsonwebtoken";

const Activate = ({ match }) => {
  const [value, setValue] = useState({
    name: "",
    token: "",
    show: true
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValue({ ...value, token, name });
    }
  }, []);

  const { name, token, show } = value;

  const onSubmit = e => {
    e.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/api/auth/account-activation`,
      data: { token }
    })
      .then(response => {
        console.log("Activate success", response);
        setValue({
          ...value,
          show: false
        });
        toast.success(response.data.message);
      })
      .catch(err => {
        console.log("Activate error", err.response.data);
        toast.error(err.response.data.error);
      });
  };
  return (
    <Fragment>
      <ToastContainer />
      <div className="text-center">
        <h1 className="p-5">Hey{name}.Ready to Activate your Account ?</h1>
        <button
          type="submit"
          className="btn btn-primary mt-5"
          onClick={onSubmit}
        >
          Activate Account
        </button>
      </div>
    </Fragment>
  );
};

export default Activate;
