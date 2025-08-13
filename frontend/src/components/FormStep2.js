import React, { useState } from 'react';

const orgTypes = [
  "Proprietorship",
  "Partnership",
  "LLP",
  "Company",
  "Society",
  "Trust"
];

export default function FormStep2({ onSubmit }) {
  const [orgType, setOrgType] = useState('');
  const [pan, setPan] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  function validate() {
    if (!orgType) return setError('Organisation type required');
    if (!/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(pan)) return setError('Invalid PAN Number');
    if (!name) return setError('PAN holder name required');
    if (!dob) return setError('Date required');
    if (!consent) return setError('Consent required');
    setError('');
    onSubmit({ orgType, panNumber: pan, panHolderName: name, dobOrDoi: dob, consent });
  }

  return (
    <div className="form-step">
      <h2>PAN Verification</h2>
      <select
        value={orgType}
        onChange={e => setOrgType(e.target.value)}
        aria-label="Select Organisation Type"
      >
        <option value="">Select Organisation Type</option>
        {orgTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter PAN Number"
        value={pan}
        onChange={e => setPan(e.target.value.toUpperCase())}
        maxLength={10}
      />
      <input
        type="text"
        placeholder="Name as per PAN"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="date"
        value={dob}
        onChange={e => setDob(e.target.value)}
        aria-label="DOB or DOI"
      />
      <label>
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          aria-label="I consent to the terms"
        />
        I, the holder of the above PAN, hereby give my consent...
      </label>
      {error && <p className="error">{error}</p>}
      <button onClick={validate}>Validate PAN</button>
    </div>
  );
}
