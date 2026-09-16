"use client";

import AuthHeader from "@/components/common/AuthHeader/AuthHeader";

export default function MainLayout({ children }) {
  return (
    <>
      <AuthHeader />
      <main>{children}</main>
    </>
  );
}
