import React from 'react';

export default function Register() {
    return (
        <form action="/register" method="post">
            <div className="nameWrapper">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required></input>
            </div>
            <div className="emailWrapper">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required></input>
            </div>
            <div className="passwordWrapper">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required></input>
            </div>
            <input type="submit" value="Register"></input>
        </form>
    )
}
