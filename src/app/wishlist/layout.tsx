import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Wishlist | KaysApparel",
  description: "Your saved favourite items from KaysApparel. Shop premium women's fashion in Nigeria.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
