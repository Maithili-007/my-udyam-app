import React from 'react';

export default function Success({ id }) {
  return (
    <div className="form-step">
      <h2>Registration Successful</h2>
      <p>Your registration ID: <b>{id}</b></p>
    </div>
  );
}
