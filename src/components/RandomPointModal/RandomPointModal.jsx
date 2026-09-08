'use client';

import { useEffect, useState } from 'react';
import RandomPointResult from './RandomPointResult.jsx';
import RandomSelection from './RandomSelection.jsx';

export default function RandomPointModal({ onClose }) {
  const [step, setStep] = useState('selecting');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') { 
        onClose();
      };
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [onClose]);

  if (step === 'selecting') {
    return (
      <RandomSelection 
        setStep={setStep}
        onClose={onClose}
      />
    );
  }

  if (step === 'result') {
    return <RandomPointResult onClose={onClose} />
  }

  return null;
}
