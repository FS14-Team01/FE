"use client";

import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          router.replace("/marketplace");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>로그인</h1>

      <label htmlFor="email">이메일</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="이메일을 입력해 주세요"
      />
      <label htmlFor="password">비밀번호</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="비밀번호를 입력해 주세요"
      />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "로그인 중..." : "로그인"}
      </button>
      {loginMutation.isError && <p>{loginMutation.error.message}</p>}

      <div>최애의 포토가 처음이신가요?</div>
      <div>회원가입하기</div>
    </form>
  );
}
