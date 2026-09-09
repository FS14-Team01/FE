"use client";

import styles from "./SearchInput.module.css";

/**
 * @param {string} value
 * @param {(value: string) => void} onChange
 * @param {(value: string) => void} [onSearch]
 * @param {string} [placeholder]
 */

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "검색",
  className,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      onSearch?.(value);
    }
  };

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <button
        type="button"
        className={styles.searchButton}
        onClick={() => onSearch?.(value)}
        aria-label="검색"
      >
        <span className={styles.searchIcon} aria-hidden="true" />
      </button>
    </div>
  );
}
