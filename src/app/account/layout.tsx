import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | KaysApparel",
  description: "Manage your KaysApparel profile, view order history and track deliveries.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
