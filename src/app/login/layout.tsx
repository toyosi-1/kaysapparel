import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | KaysApparel",
  description: "Sign in to your KaysApparel account to track orders and manage your profile.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
