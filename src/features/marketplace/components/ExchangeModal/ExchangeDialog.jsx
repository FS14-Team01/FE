"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import styles from "./ExchangeDialog.module.css";

export default function ExchangeDialog({
  title,
  eyebrow,
  mobileLayout,
  containScroll,
  onClose,
  onBack,
  children,
}) {
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const returnFocus = document.activeElement;
    const { overflow } = document.body.style;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    dialogRef.current.scrollTop = 0;
    headingRef.current.focus({ preventScroll: true });
  }, [title]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.contentDialog}
      data-mobile-layout={mobileLayout}
      data-contained-scroll={containScroll || undefined}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
    >
      <div className={styles.dialogBody}>
        <span className={styles.handle} aria-hidden="true" />
        <button
          type="button"
          className={styles.dialogClose}
          onClick={onClose}
          aria-label="모달 닫기"
        >
          <Image src="/assets/ic_close.svg" alt="" width={32} height={32} />
        </button>
        {mobileLayout === "page" && (
          <button
            type="button"
            className={styles.dialogBack}
            onClick={onBack ?? onClose}
            aria-label="카드 선택으로 돌아가기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19 12H5m7-7-7 7 7 7" />
            </svg>
          </button>
        )}
        <header>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2
            ref={headingRef}
            tabIndex={-1}
            id={titleId}
            className={styles.dialogTitle}
          >
            {title}
          </h2>
        </header>
        {children}
      </div>
    </dialog>
  );
}
