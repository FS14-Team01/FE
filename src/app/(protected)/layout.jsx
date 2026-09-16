import AuthGuard from "@/features/auth/components/AuthGuard/AuthGuard";

export default function ProtectedLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
