import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
import Register from './Register';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

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
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'));
