import Link from "next/link";
import styles from "./ProfileMenu.module.css";

export default function ProfileMenu({ user, points, onLogout, onClose }) {
  return (
    <div className={styles.menu}>
      {user ? (
        <div className={styles.summary}>
          <strong className={styles.title}>
            안녕하세요, {user.nickname}님!
          </strong>

          <div className={styles.pointRow}>
            <span>보유 포인트</span>
            <strong>{(points ?? 0).toLocaleString("ko-KR")} P</strong>
          </div>
        </div>
      ) : (
        <div className={styles.summary}>
          <strong className={styles.title}>로그인이 필요합니다</strong>

          <p className={styles.description}>로그인하고 서비스를 이용해보세요</p>

          <Link href="/login" onClick={onClose} className={styles.loginButton}>
            로그인
          </Link>
        </div>
      )}
      <nav className={styles.navigation}>
        <Link href="/marketplace" onClick={onClose}>
          마켓플레이스
        </Link>

        <Link href="/my-gallery" onClick={onClose}>
          마이갤러리
        </Link>

        <Link href="/my-sales" onClick={onClose}>
          판매 중인 포토카드
        </Link>
      </nav>
      {user && (
        <button
          type="button"
          className={styles.logoutButton}
          onClick={onLogout}
        >
          로그아웃
        </button>
      )}
    </div>
  );
}
