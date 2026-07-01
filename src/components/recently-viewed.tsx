"use client";

import { ProductCard } from "@/components/product-card";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import { Clock } from "lucide-react";

interface RecentlyViewedProps {
  excludeId?: string;
}

export function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const items = useRecentlyViewed(excludeId);

  if (items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
      <div className="flex items-center gap-2 mb-8">
        <Clock className="h-5 w-5 text-[#6B4C3B]" />
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          Recently Viewed
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
