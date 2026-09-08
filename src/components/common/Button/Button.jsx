'use client';

import styles from './Button.module.css';

/**
 * 공통 버튼
 *
 * @param {'primary' | 'secondary'} [variant] primary는 노란 배경, secondary는 테두리만
 * @param {'sm' | 'md' | 'lg'} [size]
 * @param {'button' | 'submit' | 'reset'} [type]
 * @param {boolean} [disabled]
 * @param {() => void} [onClick]
 * @param {React.ReactNode} children
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className ?? ''}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
