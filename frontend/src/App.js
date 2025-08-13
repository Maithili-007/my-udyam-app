import React, { useState } from 'react';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import Success from './components/Success';

function App() {
  const [step, setStep] = useState(1);
  const [dataStep1, setDataStep1] = useState({});
  const [successId, setSuccessId] = useState(null);

  if (successId) return <Success id={successId} />;
  if (step === 1)
    return <FormStep1 onNext={d => { setDataStep1(d); setStep(2); }} />;

  return (
    <FormStep2 onSubmit={async d => {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step1: dataStep1, step2: d }),
      });
      const json = await res.json();
      if (json.success)
        setSuccessId(json.id);
      else
        alert('Registration failed: ' + (json.error || ''));
    }} />
  );
}

export default App;

