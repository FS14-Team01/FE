"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import ProfileMenu from "../ProfileMenu/ProfileMenu";

function NotificationIcon() {
  return (
    <Image
      src="/assets/ic_notification.svg"
      alt=""
      width={24}
      height={24}
      className={styles.notificationIcon}
    />
  );
}

function RandomBoxIcon() {
  return (
    <Image
      src="/assets/ic_random_box_red.png"
      alt=""
      width={39}
      height={32}
      className={styles.randomBoxIcon}
    />
  );
}

export default function Header({
  user = null,
  points,
  canUseRandomBox,
  onLogout,
  onRandomBoxClick,
  onNotificationClick,
  onNotificationClose,
  notificationPanel,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = Boolean(user);
  const closeMenu = () => setIsMenuOpen(false);
  const notificationAreaRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const handleEscape = (event) => event.key === "Escape" && closeMenu();
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!notificationPanel) return undefined;
    const handleOutsideClick = (event) => {
      const isMobile = window.matchMedia("(max-width: 743px)").matches;
      if (isMobile) return;
      if (!notificationAreaRef.current?.contains(event.target)) {
        onNotificationClose?.();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [notificationPanel, onNotificationClose]);

  const handleLogout = () => {
    closeMenu();
    onLogout?.();
  };

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
              {canUseRandomBox && (
                <button
                  type="button"
                  className={styles.randomBoxButton}
                  aria-label="랜덤 포인트 뽑기"
                  onClick={onRandomBoxClick}
                >
                  <RandomBoxIcon />
                </button>
              )}
              <div
                className={styles.notificationArea}
                ref={notificationAreaRef}
              >
                <button
                  type="button"
                  className={styles.notificationButton}
                  aria-label="알림 보기"
                  onClick={onNotificationClick}
                >
                  <NotificationIcon />
                </button>
                {notificationPanel}
              </div>
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
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
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
          <div className={styles.mobileActions}>
            {canUseRandomBox && (
              <button
                type="button"
                className={styles.randomBoxButton}
                aria-label="랜덤 포인트 뽑기"
                onClick={onRandomBoxClick}
              >
                <RandomBoxIcon />
              </button>
            )}
            <div className={styles.notificationArea}>
              <button
                type="button"
                className={styles.mobileNotificationButton}
                aria-label="알림 보기"
                onClick={onNotificationClick}
              >
                <NotificationIcon />
              </button>
              {notificationPanel}
            </div>
          </div>
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
            <ProfileMenu
              user={user}
              points={points}
              onLogout={handleLogout}
              onClose={closeMenu}
            />
          </aside>
        </>
      )}
    </header>
  );
}
