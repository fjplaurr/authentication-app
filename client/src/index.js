import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import ResetPassword from "./ResetPassword";

const routing = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/resetpassword/:passwordToken" component={ResetPassword} />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById("root"));
