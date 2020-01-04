import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  isAuth,
  getCookie,
  logout,
  authenticate,
  updateStorage
} from "../helper";

const UserUpdate = ({ history }) => {
  const [value, setValue] = useState({
    role: "",
    name: "",
    email: "",
    password: ""
  });

  const token = getCookie("token");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/api/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("update user", response);
        const { name, email, role, password } = response.data;
        setValue({ ...value, role, name, email });
      })
      .catch(err => {
        console.log("update user error", err.response.data.error);
        if (err.response.status === 401) {
          logout(() => {
            history.push("/");
          });
        }
      });
  };

  const { role, name, email, password } = value;
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
      url: `${process.env.REACT_APP_API}/api/user/update`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { email, password }
    })
      .then(response => {
        console.log("User update success", response);
        updateStorage(response, () => {
          setValue({
            ...value
          });
          toast.success("User updated succesfully");
        });
      })
      .catch(err => {
        console.log("User update error", err);
        toast.error(err.response.data.error);
      });
  };
  return (
    <Fragment>
      <ToastContainer />

      <form onSubmit={onSubmit} className="mt-5">
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="User Role"
            name="role"
            defaultValue={role}
            disabled
          />
        </div>

        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="User Name"
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
            defaultValue={email}
            disabled
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

        <button className="btn btn-primary">Update</button>
      </form>
    </Fragment>
  );
};

export default UserUpdate;
