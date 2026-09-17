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
        <div className={styles.meta}>
          <strong className={grade ? styles[grade.toLowerCase()] : styles.category}>
            {grade ? getCardGradeLabel(grade) : "등급 미지정"}
          </strong>
          <span className={styles.separator} aria-hidden="true">|</span>
          <span className={styles.category}>
            {category ? getCardCategoryLabel(category) : "장르 미지정"}
          </span>
        </div>
        <p className={styles.description}>
          {description || "교환 희망 설명이 없습니다."}
        </p>
      </div>
    </section>
  );
}
