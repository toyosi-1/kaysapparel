"use client";

import { useSearchParams } from "next/navigation";
import { ProductDetailFetcher } from "./[id]/product-detail-fetcher";

export function ProductDetailParams() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return <ProductDetailFetcher productId={productId} />;
}
