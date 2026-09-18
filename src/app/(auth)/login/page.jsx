"use client";

import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const loginMutation = useLogin();

  function handleSubmit(event) {
    event.preventDefault();

    loginMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          const redirect = new URLSearchParams(window.location.search).get(
            "redirect",
          );
          const safeRedirect =
            redirect?.startsWith("/") && !redirect.startsWith("//")
              ? redirect
              : "/marketplace";

          router.replace(safeRedirect);
        },
      },
    );
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
        <div className={styles.messageArea}>
          {loginMutation.isError && (
            <p className={styles.errorMessage}>{loginMutation.error.message}</p>
          )}
        </div>
        <p className={styles.signUpPrompt}>
          <span>최애의 포토가 처음이신가요?</span>
          <Link href="/signup" className={styles.signUpLink}>
            회원가입하기
          </Link>
        </p>
      </form>
    </main>
  );
}
