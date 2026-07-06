import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { ProductDetailFetcher } from "./product-detail-fetcher";

export const metadata: Metadata = {
  title: "Product Details | KaysApparel",
  description: "Shop premium women's fashion at KaysApparel. Fast delivery across Nigeria.",
};

export async function generateStaticParams() {
  const products = getProducts();
  return products
    .filter((product) => product.id)
    .map((product) => ({
      id: product.id,
    }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  return <ProductDetailFetcher productId={resolvedParams.id} />;
}
