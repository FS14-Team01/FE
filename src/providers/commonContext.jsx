"use client";

import { createContext, useContext, useMemo } from "react";

const CommonContext = createContext(null);

export function CommonProvider({ children }) {
  // Provider value가 매 렌더링마다 새 객체가 되지 않도록 함
  const value = useMemo(() => ({}), []);

  return (
    <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
  );
}

export function useCommonContext() {
  const context = useContext(CommonContext);

  // Provider 밖에서 사용하면 바로 원인을 알 수 있도록 에러 발생
  if (context === null) {
    throw new Error(
      "useCommonContext는 CommonProvider 내부에서 사용해야 합니다.",
    );
  }

  return context;
}
