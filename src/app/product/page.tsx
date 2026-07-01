import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductDetailParams } from "./product-detail-params";

export const metadata: Metadata = {
  title: "Product Details | KaysApparel",
  description: "Shop premium women's fashion at KaysApparel. Fast delivery across Nigeria.",
};

function ProductDetailContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-7xl mx-auto px-5 lg:px-10 py-10">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-96 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductDetailContent />}>
      <ProductDetailParams />
    </Suspense>
  );
}
