import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Women's Fashion | KaysApparel",
  description: "Browse 40+ premium dresses, tops, skirts, trousers, shorts and two-piece sets. Fast delivery across Lagos and all 36 states in Nigeria.",
  openGraph: {
    title: "Shop Women's Fashion | KaysApparel",
    description: "Premium women's fashion for the bold Nigerian woman. New arrivals weekly.",
    url: "https://kaysapparel.com/shop",
    type: "website",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
