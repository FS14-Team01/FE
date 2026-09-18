"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ExchangeDialog.module.css";

const DRAG_CLOSE_DISTANCE = 120;

function getFocusableElements(element) {
  return Array.from(
    element.querySelectorAll(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (target) =>
      !target.disabled && target.tabIndex >= 0 && target.getClientRects().length > 0,
  );
}

export default function ExchangeDialog({
  title,
  eyebrow,
  mobileLayout,
  containScroll,
  onClose,
  onBack,
  isBusy = false,
  children,
}) {
  const dialogRef = useRef(null);
  const scrollRef = useRef(null);
  const activeDialogRef = useRef(null);
  const headingRef = useRef(null);
  const dragRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const titleId = useId();

  const resetDrag = (event) => {
    dragRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleDragStart = (event) => {
    if (isBusy || !event.isPrimary || event.button !== 0 || dragRef.current) return;
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (isBusy) {
      resetDrag(event);
      return;
    }
    setDragOffset(Math.max(0, event.clientY - drag.startY));
  };

  const handleDragEnd = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = event.clientY - drag.startY;
    resetDrag(event);
    if (!isBusy && distance >= DRAG_CLOSE_DISTANCE) onClose();
  };

  const handleDragCancel = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) resetDrag(event);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const returnFocus = document.activeElement;
    const { overflow } = document.body.style;
    activeDialogRef.current = dialog;
    document.body.style.overflow = "hidden";

    // 공통 MobileFilterSheet는 body에 포털로 열린다. 필터가 열린 동안만
    // 포커스 범위를 해당 시트로 옮기고, 닫으면 원래 필터 버튼으로 돌려준다.
    let filterReturnFocus;
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (
            !(node instanceof HTMLElement) ||
            !node.matches('[role="dialog"]')
          ) continue;
          filterReturnFocus = document.activeElement;
          activeDialogRef.current = node;
          const target =
            node.querySelector('[role="tab"][aria-selected="true"]') ??
            getFocusableElements(node)[0];
          target?.focus({ preventScroll: true });
        }
        for (const node of record.removedNodes) {
          if (node !== activeDialogRef.current) continue;
          activeDialogRef.current = dialog;
          if (filterReturnFocus?.isConnected) {
            filterReturnFocus.focus({ preventScroll: true });
          }
        }
      }
    });
    observer.observe(document.body, { childList: true });

    const handleFocusIn = (event) => {
      const activeDialog = activeDialogRef.current;
      if (!activeDialog?.isConnected || activeDialog.contains(event.target)) return;
      (getFocusableElements(activeDialog)[0] ?? headingRef.current)?.focus({
        preventScroll: true,
      });
    };
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", handleFocusIn);
      activeDialogRef.current = null;
      document.body.style.overflow = overflow;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTop = 0;
    headingRef.current.focus({ preventScroll: true });
  }, [title]);

  useEffect(() => {
    // 요청 중 버튼이 disabled되면서 BODY로 빠지는 포커스를 모달에 유지한다.
    if (!activeDialogRef.current?.contains(document.activeElement)) {
      headingRef.current?.focus({ preventScroll: true });
    }

    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return;
      const activeDialog = activeDialogRef.current;

      if (event.key === "Escape" && activeDialog === dialogRef.current) {
        event.preventDefault();
        if (!isBusy) onClose();
      }

      if (event.key !== "Tab" || !activeDialog) return;
      const elements = getFocusableElements(activeDialog);
      const first = elements[0];
      const last = elements[elements.length - 1];
      const focused = document.activeElement;
      if (!first) {
        event.preventDefault();
      } else if (
        event.shiftKey && (focused === first || !elements.includes(focused))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey && (focused === last || !elements.includes(focused))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isBusy, onClose]);

  return (
    <div
      ref={dialogRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-busy={isBusy}
    >
      <div
        ref={scrollRef}
        className={`${styles.contentDialog}${isDragging ? ` ${styles.dragging}` : ""}`}
        style={{ transform: dragOffset ? `translateY(${dragOffset}px)` : undefined }}
        data-exchange-scroll
        data-mobile-layout={mobileLayout}
        data-contained-scroll={containScroll || undefined}
      >
        <div className={styles.dialogBody}>
          <button
            type="button"
            className={styles.handle}
            aria-label="아래로 끌어서 모달 닫기"
            disabled={isBusy}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragCancel}
            onLostPointerCapture={handleDragCancel}
            onClick={(event) => {
              // 키보드·보조기기의 클릭은 허용하고 짧은 드래그 뒤 클릭은 무시한다.
              if (event.detail === 0 && !isBusy) onClose();
            }}
          />
          <button
            type="button"
            className={styles.dialogClose}
            onClick={onClose}
            disabled={isBusy}
            aria-label="모달 닫기"
          >
            <Image src="/assets/ic_close.svg" alt="" width={32} height={32} />
          </button>
          {mobileLayout === "page" && (
            <button
              type="button"
              className={styles.dialogBack}
              onClick={onBack ?? onClose}
              disabled={isBusy}
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
      </div>
    </div>
  );
}
