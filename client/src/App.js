import React, { Fragment } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/auth/privateRoute";
import AdminRoute from "./components/auth/AdminRoute";
//Components
import Navbar from "./components/Layouts/Navbar";
import Home from "./components/Layouts/Home";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Activate from "./components/auth/Activate";
import Dashboard from "./components/main/Dashboard";
import Admin from "./components/main/Admin";
import ForgotPw from "./components/auth/ForgotPw";
import ResetPw from "./components/auth/ResetPw";

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <div className="container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgetPassword" component={ForgotPw} />
          <Route path="/resetPassword/:token" component={ResetPw} />
          <Route path="/activate/:token" component={Activate} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <AdminRoute path="/admin" component={Admin} />
        </Switch>
      </div>
    </Fragment>
  );
};

export default App;
