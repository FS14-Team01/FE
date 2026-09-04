'use client';

import { useRouter } from 'next/navigation';
import styles from './MobilePageHeader.module.css';

export default function MobilePageHeader({ title }) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.backButton}
        aria-label="이전 페이지로 이동"
        onClick={() => router.back()}
      >
        <svg
          aria-hidden="true"
          width="11"
          height="18"
          viewBox="0 0 11 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.84934 17.6987L0 8.84934L8.84934 0L10.1503 1.30093L2.60189 8.84934L10.1503 16.3977L8.84934 17.6987Z"
            fill="white"
          />
        </svg>
      </button>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
