"use client";

import { useState } from "react";
import { useSignup } from "@/features/auth/hooks/use-sign-up";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);
  const router = useRouter();
  const signupMutation = useSignup();
  const normalizedEmail = email.trim().toLowerCase();
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9_]+$/;
  const normalizedNickname = nickname.trim();

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setValidationError("이메일을 입력해 주세요.");
      return;
    }

    if (normalizedEmail.length > 254) {
      setValidationError("이메일은 254자 이내로 입력해 주세요.");
      return;
    }

    if (EMAIL_PATTERN.test(normalizedEmail) === false) {
      setValidationError("올바른 이메일 주소를 입력해 주세요.");
      return;
    }

    if (normalizedNickname === "") {
      setValidationError("닉네임을 입력해 주세요.");
      return;
    }

    if (normalizedNickname.length < 2 || normalizedNickname.length > 20) {
      setValidationError("닉네임은 2~20자로 입력해 주세요.");
      return;
    }

    if (NICKNAME_PATTERN.test(normalizedNickname) === false) {
      setValidationError(
        "닉네임에는 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.",
      );
      return;
    }

    if (password === "") {
      setValidationError("비밀번호를 입력해 주세요.");
      return;
    }

    if (passwordConfirm === "") {
      setValidationError("비밀번호를 한 번 더 입력해 주세요.");
      return;
    }

    if (password.length < 8 || password.length > 64) {
      setValidationError("비밀번호는 8~64자로 입력해 주세요.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setValidationError("비밀번호를 더 짧게 입력해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setValidationError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setValidationError("");

    signupMutation.mutate(
      {
        email,
        nickname,
        password,
      },
      {
        onSuccess: () => {
          router.replace("/marketplace");
        },
      },
    );
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Image
          src="/assets/logo.png"
          alt="로고"
          width={250}
          height={49}
          className={styles.logo}
        />
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일을 입력해 주세요"
        />
        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          type="text"
          required
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="닉네임을 입력해 주세요"
        />
        <label htmlFor="password">비밀번호</label>
        <div className={styles.passwordInputWrapper}>
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력해 주세요"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setIsPasswordVisible((current) => !current)}
          >
            <Image
              src={
                isPasswordVisible
                  ? "/assets/ic_visibleX.png"
                  : "/assets/ic_visible.png"
              }
              className={styles.passwordIcon}
              alt={isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보이기"}
              width={24}
              height={24}
            />
          </button>
        </div>

        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <div className={styles.passwordInputWrapper}>
          <input
            id="passwordConfirm"
            type={isPasswordConfirmVisible ? "text" : "password"}
            required
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="비밀번호를 한번 더 입력해 주세요"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setIsPasswordConfirmVisible((current) => !current)}
          >
            <Image
              src={
                isPasswordConfirmVisible
                  ? "/assets/ic_visibleX.png"
                  : "/assets/ic_visible.png"
              }
              className={styles.passwordIcon}
              alt={
                isPasswordConfirmVisible ? "비밀번호 숨기기" : "비밀번호 보이기"
              }
              width={24}
              height={24}
            />
          </button>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "가입 중..." : "가입하기"}
        </button>
        <div className={styles.messageArea}>
          {validationError && (
            <p className={styles.errorMessage}>{validationError}</p>
          )}

          {!validationError && signupMutation.isError && (
            <p className={styles.errorMessage}>
              {signupMutation.error.message}
            </p>
          )}
        </div>
        <p className={styles.signUpPrompt}>
          <span>이미 최애의 포토 회원이신가요?</span>
          <Link href="/login" className={styles.signUpLink}>
            로그인하기
          </Link>
        </p>
      </form>
    </main>
  );
}
