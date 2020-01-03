import React from 'react';

export default function App() {
  return (
    <div className="App">
      <form action="/logout" method="get">
        <input type="submit" name="logout" value="Log Out"></input>
      </form>
    </div >
  );
}

