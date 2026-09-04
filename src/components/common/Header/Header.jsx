'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './Header.module.css'

const formatPoints = (points) => new Intl.NumberFormat('ko-KR').format(points)

function NotificationIcon() {
  return (
    <Image
      src="/assets/ic_notification.svg"
      alt=""
      width={24}
      height={24}
      className={styles.notificationIcon}
    />
  )
}

export default function Header({ user = null, onLogout, onNotificationClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAuthenticated = Boolean(user)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    if (!isMenuOpen) return undefined
    const handleEscape = (event) => event.key === 'Escape' && closeMenu()
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  const handleLogout = () => {
    closeMenu()
    onLogout?.()
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink} aria-label="최애의 포토 홈">
          <Image
            src="/assets/logo.png"
            alt="최애의 포토"
            width={250}
            height={49}
            className={styles.logo}
            priority
          />
        </Link>

        <nav className={styles.navigation} aria-label="주요 메뉴">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className={styles.notificationButton}
                aria-label="알림 보기"
                onClick={onNotificationClick}
              >
                <NotificationIcon />
              </button>
              <Link href="/" className={styles.nickname}>
                {user.nickname}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.authLink}>
                로그인
              </Link>
              <Link href="/signup" className={styles.authLink}>
                회원가입
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-user-menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <Image src="/assets/ic_menu.svg" alt="" width={17} height={12} />
        </button>

        {!isAuthenticated && (
          <Link href="/login" className={styles.mobileLoginLink}>
            로그인
          </Link>
        )}
        {isAuthenticated && (
          <button
            type="button"
            className={styles.mobileNotificationButton}
            aria-label="알림 보기"
            onClick={onNotificationClick}
          >
            <NotificationIcon />
          </button>
        )}
      </div>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="메뉴 닫기"
            onClick={closeMenu}
          />
          <aside
            id="mobile-user-menu"
            className={styles.drawer}
            aria-label="사용자 메뉴"
          >
            {isAuthenticated ? (
              <div className={styles.userSummary}>
                <strong>안녕하세요, {user.nickname}님!</strong>
                <div className={styles.pointRow}>
                  <span>보유 포인트</span>
                  <strong>{formatPoints(user.points ?? 0)} P</strong>
                </div>
              </div>
            ) : (
              <div className={`${styles.userSummary} ${styles.guestSummary}`}>
                <strong>로그인이 필요합니다</strong>
                <p>로그인하고 서비스를 이용해보세요</p>
                <Link
                  href="/login"
                  className={styles.drawerLoginButton}
                  onClick={closeMenu}
                >
                  로그인
                </Link>
              </div>
            )}

            <nav className={styles.drawerNavigation} aria-label="사용자 페이지">
              <Link href="/" onClick={closeMenu}>
                마켓플레이스
              </Link>
              <Link href="/" onClick={closeMenu}>
                마이갤러리
              </Link>
              <Link href="/" onClick={closeMenu}>
                판매 중인 포토카드
              </Link>
            </nav>

            {isAuthenticated && (
              <button
                type="button"
                className={styles.drawerLogoutButton}
                onClick={handleLogout}
              >
                로그아웃
              </button>
            )}
          </aside>
        </>
      )}
    </header>
  )
}
