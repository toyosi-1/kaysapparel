import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | KaysApparel",
  description: "Create a KaysApparel account to track your orders and enjoy a faster checkout experience.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
