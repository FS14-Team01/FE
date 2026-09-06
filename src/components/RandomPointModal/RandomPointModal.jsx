'use client';

import { useState } from 'react';
import RandomPointResult from './RandomPointResult.jsx';
import RandomSelection from './RandomSelection.jsx';

export default function RandomPointModal() {
  const [step, setStep] = useState('selecting');
  if (step === 'selecting') {
    return <RandomSelection setStep={setStep} />
  }

  if (step === 'result') {
    return <RandomPointResult />
  }

}