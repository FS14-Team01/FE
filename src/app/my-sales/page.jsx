"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal/Modal";
import ResponsiveHeader from "@/components/common/ResponsiveHeader/ResponsiveHeader";
import MySalesPage from "@/features/marketplace/components/MySalesPage/MySalesPage";
import { getAccessToken } from "@/lib/auth-token";

export default function MySalesRoute() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = window.setTimeout(() => {
      setIsAuthenticated(Boolean(getAccessToken()));
      setIsAuthChecked(true);
    }, 0);

    return () => window.clearTimeout(checkAuth);
  }, []);

  const handleLogin = () => {
    router.push("/login?redirect=/my-sales");
  };

  const handleClose = () => {
    router.replace("/marketplace");
  };

  return (
    <>
      <ResponsiveHeader title="나의 판매 포토카드" />
      {isAuthChecked && isAuthenticated && (
        <main>
          <MySalesPage />
        </main>
      )}
      {isAuthChecked && !isAuthenticated && (
        <Modal
          title="로그인이 필요합니다."
          message="로그인하고 나의 판매 포토카드를 확인해 보세요."
          confirmText="로그인하기"
          onConfirm={handleLogin}
          onClose={handleClose}
        />
      )}
    </>
  );
}
