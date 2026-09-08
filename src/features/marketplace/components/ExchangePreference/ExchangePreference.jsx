import styles from './ExchangePreference.module.css'

export default function ExchangePreference({ variant = 'full' }) {
  return (
    <section
      className={`${styles.section} ${styles[variant]}`}
      aria-labelledby={`exchange-preference-title-${variant}`}
    >
      <div className={styles.heading}>
        <h2
          id={`exchange-preference-title-${variant}`}
          className={styles.title}
        >
          교환 희망 정보
        </h2>
      </div>

      <div className={styles.content}>
        {/* 교환 희망 정보 기능 */}
      </div>
    </section>
  )
}
