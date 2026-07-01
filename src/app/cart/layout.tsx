import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | KaysApparel",
  description: "Review your selected items and proceed to checkout. Fast delivery across Nigeria.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
