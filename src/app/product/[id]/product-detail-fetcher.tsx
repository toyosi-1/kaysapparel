"use client";

import { useState, useEffect } from "react";
import { productService } from "@/lib/firebase-services";
import { Product } from "@/lib/types";
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
    const loadProduct = async () => {
      try {
        const fetched = await productService.getById(productId) as Product | null;
        if (fetched) {
          setProduct(fetched);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
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
