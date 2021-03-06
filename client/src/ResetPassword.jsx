import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { passwordToken } = useParams();
  const [newPass, setPass] = useState("");
  const sendPass = () => {
    axios.post("http://localhost:3001/resetpassword", {
      newPass,
      passwordToken
    });
  };
  return (
    <div>
      <div className='passwordWrapper'>
        <label htmlFor='password'>
          New password
          <input
            type='password'
            id='password'
            name='password'
            required
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
        </label>
      </div>
      <button type='button' onClick={sendPass}>
        Register
      </button>
    </div>
  );
}
