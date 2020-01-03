import React from 'react';

export default function Login() {
    return (
        <form action="/login" method="post">
            <div className="nameWrapper">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required></input>
            </div>
            <div className="passwordWrapper">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required></input>
            </div>
            <button type="submit">Login</button>
        </form>
    )
}
