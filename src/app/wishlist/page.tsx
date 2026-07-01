"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { useWishlistStore } from "@/lib/store";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-2">
            Saved Items
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-gray-900">
            Your Wishlist
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">
              Your wishlist is empty
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Tap the heart on any product to save it here
            </p>
            <Link href="/shop">
              <Button className="bg-[#6B4C3B] hover:bg-[#6B4C3B]/90 text-white rounded-none px-6">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
