'use client';

import { useState } from 'react';
import Header from '@/components/common/Header/Header';
import SearchInput from '@/components/marketplace/SearchInput';
import styles from './page.module.css';

export default function MarketplacePage() {
  const [keyword, setKeyword] = useState('');

  const handleSearch = (value) => {
    // TODO: marketKeys.list({ keyword: value, ... }) 연동
    console.log('검색어:', value);
  };

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>마켓플레이스</h1>
        </div>

        <div className={styles.filterRow}>
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
          />

          <div className={styles.sortArea}>
          </div>

        </div>
        <section className={styles.cardSection} aria-label="판매 중인 포토카드">
        </section>
      </main>
    </>
  );
}
