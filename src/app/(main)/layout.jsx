'use client';

import Header from '@/components/common/Header/Header';
import RandomPointModal from '@/components/RandomPointModal/RandomPointModal';
import { useState } from 'react';

export default function MainLayout({ children }) {
  const [isRandomPointOpen, setIsRandomPointOpen] = useState(false);

  const openRandomPoint = () => setIsRandomPointOpen(true);
  const closeRandomPoint = () => setIsRandomPointOpen(false);

  return (
    <>
      <Header onRandomBoxClick={openRandomPoint} />
      <main>{children}</main>

      {isRandomPointOpen && (
        <RandomPointModal onClose={closeRandomPoint} />
      )}
    </>
  )
}
