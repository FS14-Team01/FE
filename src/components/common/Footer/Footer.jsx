import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p>
            본 사이트는 학습 목적으로 제작된 팀 프로젝트입니다.
            <br />
            실제 상품의 판매 및 거래는 이루어지지 않습니다.
          </p>
        </div>

        <div className={styles.info}>
          <nav className={styles.links} aria-label='프로젝트 관련 링크'>
            <a
              href='https://app.notion.com/p/8a801b4843188232bb5981c83ac95aad?v=d0b01b48431882a7ad4588c2e9d65517'
              target='_blank'
              rel='noopener noreferrer'
            >
              프로젝트 소개
            </a>
            <span aria-hidden='true'>·</span>
            <a
              href='https://github.com/FS14-Team01'
              target='_blank'
              rel='noopener noreferrer'
            >
              GitHub
            </a>
          </nav>

          <small className={styles.copyright}>
            &copy; 2026 최애의 포토
          </small>
        </div>
      </div>
    </footer>
  );
}
