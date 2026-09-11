"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import styles from "@/components/MobileFilterSheet/MobileFilterSheet.module.css";
import modalStyles from "./ExchangeModal.module.css";

const TABS = [
  { key: "grade", label: "등급" },
  { key: "category", label: "장르" },
];

const EMPTY_SELECTION = { tab: undefined, value: undefined };

/** 교환 모달 안에서만 사용하는 등급/카테고리 필터. */
export default function ExchangeMobileFilter({
  gradeOptions = [],
  categoryOptions = [],
  grade,
  category,
  onApply,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("grade");
  const [selection, setSelection] = useState(EMPTY_SELECTION);
  const titleId = useId();
  const dialogRef = useRef(null);

  const optionsByTab = {
    grade: gradeOptions,
    category: categoryOptions,
  };

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const returnFocus = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const getCurrentSelection = () => {
    if (grade) return { tab: "grade", value: grade };
    if (category) return { tab: "category", value: category };
    return EMPTY_SELECTION;
  };

  const handleOpen = () => {
    const current = getCurrentSelection();
    setSelection(current);
    setActiveTab(current.tab ?? "grade");
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  const handleSelect = (optionValue) => {
    setSelection((prev) =>
      prev.tab === activeTab && prev.value === optionValue
        ? EMPTY_SELECTION
        : { tab: activeTab, value: optionValue },
    );
  };

  const handleReset = () => {
    setSelection((prev) => (prev.tab === activeTab ? EMPTY_SELECTION : prev));
  };

  const handleApply = () => {
    onApply?.({
      grade: selection.tab === "grade" ? selection.value : undefined,
      category: selection.tab === "category" ? selection.value : undefined,
    });
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
        <dialog
          ref={dialogRef}
          className={`${styles.overlay} ${modalStyles.filterDialog}`}
          aria-labelledby={titleId}
          onCancel={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleClose();
          }}
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
              {TABS.filter((tab) => optionsByTab[tab.key].length > 0).map(
                (tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ),
              )}
            </div>

            <ul className={styles.optionList} role="listbox">
              {optionsByTab[activeTab].map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={
                      selection.tab === activeTab &&
                      selection.value === option.value
                    }
                    className={`${styles.option} ${activeTab === "grade" ? styles[option.value.toLowerCase()] : ""}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
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
                포토보기
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
