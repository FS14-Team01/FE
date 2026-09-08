'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import styles from './MobileFilterSheet.module.css';

const TABS = [
  { key: 'grade', label: '등급' },
  { key: 'category', label: '장르' },
  { key: 'saleStatus', label: '매진 여부' },
];

/**
 * 모바일 전용 통합 필터 바텀시트
 *
 * @param {{ value: string, label: string }[]} gradeOptions
 * @param {{ value: string, label: string }[]} categoryOptions
 * @param {{ value: string, label: string }[]} saleStatusOptions
 * @param {string} [grade] 선택된 등급
 * @param {string} [category] 선택된 장르
 * @param {string} [saleStatus] 선택된 매진 여부
 * @param {Record<string, number>} [counts] value별 표시 개수. 없으면 표시하지 않음
 * @param {number} [totalCount] 하단 버튼에 표시할 전체 개수
 * @param {(next: { grade?: string, category?: string, saleStatus?: string }) => void} onApply
 */
export default function MobileFilterSheet({
  gradeOptions = [],
  categoryOptions = [],
  saleStatusOptions = [],
  grade,
  category,
  saleStatus,
  counts,
  totalCount,
  onApply,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('grade');
  const [draft, setDraft] = useState({ grade, category, saleStatus });
  const titleId = useId();

  const optionsByTab = {
    grade: gradeOptions,
    category: categoryOptions,
    saleStatus: saleStatusOptions,
  };

  const handleOpen = () => {
    setDraft({ grade, category, saleStatus });
    setActiveTab('grade');
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  const handleSelect = (optionValue) => {
    setDraft((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] === optionValue ? undefined : optionValue,
    }));
  };

  const handleReset = () => {
    setDraft((prev) => ({ ...prev, [activeTab]: undefined }));
  };

  const handleApply = () => {
    onApply?.(draft);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={handleOpen}
        aria-label="필터"
      >
        <Image src="/assets/ic_filter.png" alt="" width={20} height={20} />
      </button>

      {isOpen && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className={styles.backdrop}
            aria-label="필터 닫기"
            onClick={handleClose}
          />

          <div className={styles.sheet}>
            <div className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                필터
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="필터 닫기"
              >
                <Image
                  src="/assets/ic_close.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </button>
            </div>

            <div className={styles.tabs} role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <ul className={styles.optionList} role="listbox">
              {optionsByTab[activeTab].map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={draft[activeTab] === option.value}
                    className={styles.option}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    {counts?.[option.value] != null && (
                      <span className={styles.count}>
                        {counts[option.value]}개
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                aria-label="현재 탭 필터 초기화"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M17.5 10a7.5 7.5 0 1 1-2.2-5.3M17.5 2.5v4.2h-4.2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={styles.applyButton}
                onClick={handleApply}
              >
                {totalCount != null ? `${totalCount}개 포토보기` : '포토보기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
