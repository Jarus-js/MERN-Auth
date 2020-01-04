import React from "react";
import axios from "axios";

const Google = () => {
  const onClick = e => {
    console.log("button clicked");
    e.preventDefault();
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/api/auth/google`
    })
      .then(response => {
        console.log("Google Login success", response);
      })
      .catch(err => {
        console.log("Login error", err);
      });
  };
  return (
    <div>
      <button className="btn-success" onClick={onClick}>
        Login With Google
      </button>
    </div>
  );
};
export default Google;
