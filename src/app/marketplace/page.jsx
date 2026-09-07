'use client';

import { useState } from 'react';
import Header from '@/components/common/Header/Header';
import SearchInput from '@/components/common/SearchInput/SearchInput';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import {
  GRADE_OPTIONS,
  CATEGORY_OPTIONS,
  MARKET_SORT_OPTIONS,
} from '@/components/common/Dropdown/dropdownOptions';
import styles from './page.module.css';

export default function MarketplacePage() {
  const [keyword, setKeyword] = useState('');
  const [grade, setGrade] = useState();
  const [category, setCategory] = useState();
  const [sort, setSort] = useState('recent');

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

          <Dropdown
            options={GRADE_OPTIONS}
            value={grade}
            onChange={setGrade}
            placeholder="등급"
            label="등급 필터"
          />

          <Dropdown
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
            placeholder="장르"
            label="장르 필터"
          />

          <div className={styles.sortArea}>
            <Dropdown
              options={MARKET_SORT_OPTIONS}
              value={sort}
              onChange={setSort}
              label="정렬 기준"
              variant="sort"
            />
          </div>
        </div>
        <section className={styles.cardSection} aria-label="판매 중인 포토카드">
        </section>
      </main>
    </>
  );
}
