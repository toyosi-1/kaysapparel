import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | KaysApparel",
  description: "Track the status of your KaysApparel order in real time — from payment confirmation to delivery.",
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
