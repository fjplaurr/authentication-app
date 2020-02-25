import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const sendEmail = async () => {
    await axios.post("http://localhost:3001/forgotpassword", { email });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await axios.post("http://localhost:3001/login", {
      email,
      password
    });
    // No messages means the login was successful.
    if (typeof res.data.message === "undefined") {
      history.push("/");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='emailWrapper'>
          <label htmlFor='wew'>
            Email
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type='email'
              id='email'
              name='email'
              required
            />
          </label>
        </div>
        <div className='passwordWrapper'>
          <label htmlFor='email'>
            Password
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type='password'
              id='password'
              name='password'
              required
            />
          </label>
        </div>
        <input value='Login' type='submit' />
      </form>
      <button type='button' onClick={sendEmail}>
        Forgot password
      </button>
    </>
  );
}
