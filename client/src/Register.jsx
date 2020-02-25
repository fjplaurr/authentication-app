import React from "react";

export default function Register() {
  return (
    <form action='/register' method='post'>
      <div className='nameWrapper'>
        <label htmlFor='name'>
          Name
          <input type='text' id='name' name='name' required />
        </label>
      </div>
      <div className='emailWrapper'>
        <label htmlFor='email'>
          Email
          <input type='email' id='email' name='email' required />
        </label>
      </div>
      <div className='passwordWrapper'>
        <label htmlFor='password'>
          Password
          <input type='password' id='password' name='password' required />
        </label>
      </div>
      <input type='submit' value='Register' />
    </form>
  );
}
