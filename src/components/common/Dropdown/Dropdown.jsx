'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './Dropdown.module.css';

/**
 * 공통 드롭다운
 *
 * @param {{ value: string, label: string }[]} options
 * @param {string} [value] 선택된 option의 value
 * @param {(value: string) => void} onChange
 * @param {string} placeholder 선택 전 표시할 문구
 * @param {string} label 스크린리더용 이름
 * @param {'filter' | 'sort'} [variant] filter는 라벨 길이에 맞는 텍스트형, sort는 너비가 고정된 박스형
 */
export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = '선택',
  label,
  variant = 'filter',
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxId = useId();

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      className={`${styles.container} ${variant === 'sort' ? styles.sort : ''} ${className ?? ''}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type='button'
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={label}
      >
        <span
          className={`${styles.triggerText} ${selectedOption ? '' : styles.placeholder}`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
          aria-hidden='true'
        />
      </button>

      {isOpen && (
        <ul className={styles.list} id={listboxId} role='listbox'>
          {options.map((option) => (
            <li key={option.value} role='none'>
              <button
                type='button'
                className={styles.option}
                role='option'
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
