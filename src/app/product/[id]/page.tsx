import { notFound } from "next/navigation";
import { getProducts, getProductById } from "@/lib/data-service";
import { ProductDetail } from "./product-detail";

export async function generateStaticParams() {
  const products = await getProducts();
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
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
