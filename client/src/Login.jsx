import React, { useState } from 'react';
import axios from 'axios';


export default function Login() {
    function sendEmail() {
        if (email) {
            axios.post('http://localhost:3000/forgotpassword', { email }).then((res) => {
                console.log('email is ');
            });
        }
    }

    const [email, setEmail] = useState('');
    return (
        <>
            <form action="/login" method="post">
                <div className="emailWrapper">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => { setEmail(e.target.value) }} type="email" id="email" name="email" required></input>
                </div>
                <div className="passwordWrapper">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required></input>
                </div>
                <input type="submit" value="Login"></input>
            </form>
            {<button onClick={() => sendEmail()}>Forgot password</button>}
        </>
    );

}
