import React, { useState } from 'react';

export default function FormStep1({ onNext }) {
  const [aadhaar, setAadhaar] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  function validate() {
    if (!/^\d{12}$/.test(aadhaar)) return setError('Invalid Aadhaar Number');
    if (!name) return setError('Name is required');
    if (!consent) return setError('Consent required');
    setError('');
    onNext({ aadhaarNumber: aadhaar, entrepreneurName: name, consent });
  }

  return (
    <div className="form-step">
      <h2>Aadhaar Verification</h2>
      <input
        type="text"
        placeholder="Your Aadhaar No"
        value={aadhaar}
        onChange={e => setAadhaar(e.target.value)}
        maxLength={12}
        inputMode="numeric"
      />
      <input
        type="text"
        placeholder="Name as per Aadhaar"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} aria-label="I consent to the terms" />
        I, the holder of the above Aadhaar, hereby give my consent...
      </label>
      {error && <p className="error">{error}</p>}
      <button onClick={validate}>Validate & Continue</button>
    </div>
  );
}