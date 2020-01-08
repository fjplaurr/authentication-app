import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword(props) {
  let { passwordToken } = useParams();
  const [newPass, setPass] = useState('');
  const sendPass = () => {
    axios.post('http://localhost:3000/resetpassword', { newPass, passwordToken })
  };
  return (
    <div>
      <div className="passwordWrapper">
        <label htmlFor="password">New password</label>
        <input type="password" id="password" name="password" required onChange={(e) => { setPass(e.target.value) }
        } />
      </div>
      <button type="button" onClick={() => sendPass()}>Register</button>
    </div>
  )
}

