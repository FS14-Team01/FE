"use client"
import { createContext, useContext, useState } from "react";

const CommonContext = createContext();

export function CommonProvider({ children }) {
  const [sampleState, setSampleState] = useState("");
  return (
    <CommonContext.Provider value={{
      sampleState,
      setSampleState
    }}>
      {children}
    </CommonContext.Provider>
  );
}
export function useCommonContext() {
 return useContext(CommonContext)
}