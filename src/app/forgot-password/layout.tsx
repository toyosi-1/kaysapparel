import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | KaysApparel",
  description: "Reset your KaysApparel account password.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
