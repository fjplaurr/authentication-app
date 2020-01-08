import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom';

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
            <Route path="/resetpassword/:passwordToken" component={ResetPassword}>

            </Route>
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'));
