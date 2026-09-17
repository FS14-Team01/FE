import {
  getCardCategoryLabel,
  getCardGradeLabel,
} from "@/constants/marketplace-options";
import styles from "./ExchangePreference.module.css";

export default function ExchangePreference({ sale, variant = "full" }) {
  const grade = sale?.desiredGrade;
  const category = sale?.desiredCategory;
  const description = sale?.desiredDescription?.trim();
  return (
    <section
      className={`${styles.section} ${styles[variant]}`}
      aria-labelledby={`exchange-preference-title-${variant}`}
    >
      <div className={styles.heading}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 7a9 9 0 0 0-15-2L2 8m0 0V2m0 6h6M4 17a9 9 0 0 0 15 2l3-3m0 0v6m0-6h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2
          id={`exchange-preference-title-${variant}`}
          className={styles.title}
        >
          교환 희망 정보
        </h2>
      </div>

      <div className={styles.content}>
        {(grade || category) && (
          <div className={styles.meta}>
            {grade && <strong className={styles[grade.toLowerCase()]}>{getCardGradeLabel(grade)}</strong>}
            {grade && category && <span className={styles.separator} aria-hidden="true">|</span>}
            {category && <span className={styles.category}>{getCardCategoryLabel(category)}</span>}
          </div>
        )}
        {description && <p className={styles.description}>{description}</p>}
        {!grade && !category && !description && (
          <p className={styles.description}>등록된 교환 희망 정보가 없습니다.</p>
        )}
      </div>
    </section>
  );
}
