"use client";

import { useState, useEffect } from "react";
import { productService } from "@/lib/firebase-services";
import { Product } from "@/lib/types";
import { getProductById } from "@/lib/data";
import { ProductDetail } from "./product-detail";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductDetailFetcherProps {
  productId: string;
}

export function ProductDetailFetcher({ productId }: ProductDetailFetcherProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Show static product immediately so the page feels instant
    const fallback = getProductById(productId);
    if (fallback) {
      setProduct(fallback);
      setLoading(false);
    }

    // Subscribe to real-time updates for this product so admin edits reflect instantly
    const unsubscribe = productService.subscribeToById(productId, (fetched) => {
      console.log("[product realtime]", productId, fetched?.images?.[0]);
      if (fetched) {
        setProduct(fetched);
      } else if (!fallback) {
        setError(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B4C3B]" />
        <p className="text-sm text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop">
          <Button className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
