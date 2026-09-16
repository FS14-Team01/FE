"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal/Modal";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { getAccessToken } from "@/lib/auth-token";
import styles from "./AuthGuard.module.css";

// 서버와 클라이언트 hydration 상태를 구분하기 위한 고정 구독 함수
const subscribe = () => () => {};

export default function AuthGuard({ children }) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const hasAccessToken = Boolean(getAccessToken());

  // Guard의 목적을 명시적으로 드러내기 위해 isSuccess 사용
  const { isLoading, isError, isSuccess, error, refetch, isFetching } =
    useCurrentUser();

  // 백엔드 인증 정책에 따라 사용자 정보 없음·유효하지 않은 토큰은 401로 통일
  const isAuthenticationError = !hasAccessToken || error?.status === 401;

  if (!isClient) return null;

  // Access Token이 없거나 사용자 조회가 최종 401이면 로그인 안내
  // 모달을 닫으면 이전 페이지로 이동
  if (isAuthenticationError) {
    return (
      <Modal
        title="로그인이 필요합니다."
        message={
          <>
            로그인 하시겠습니까?
            <br />
            다양한 서비스를 편리하게 이용하실 수 있습니다.
          </>
        }
        confirmText="확인"
        onConfirm={() => router.push("/login")}
        onClose={() => router.back()}
      />
    );
  }

  // Access Token이 있고 사용자 조회 중이면 화면 렌더링 보류
  if (isLoading) return null;

  // 인증 문제가 아닌 조회 실패는 서비스 공통 재시도 흐름 적용
  if (isError) {
    return (
      <div className={styles.errorState} role="alert">
        <p className={styles.errorMessage}>
          사용자 정보를 불러오지 못했습니다.
        </p>

        <button
          className={styles.retryButton}
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 사용자 조회가 성공하기 전에는 보호 페이지를 렌더링하지 않음
  if (!isSuccess) return null;

  // 인증 확인이 완료된 경우에만 보호 페이지 렌더링
  return children;
}
