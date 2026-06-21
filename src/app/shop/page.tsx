"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/data";
import { getProducts, getProductsByCategory } from "@/lib/data-service";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { Product } from "@/lib/types";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = selectedCategory 
          ? await getProductsByCategory(selectedCategory)
          : await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  // Update selected category when URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-2">
            {selectedCategory ? "Category" : "All Products"}
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-gray-900">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || "Shop"
              : "Shop All"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-gray-100">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 text-sm font-medium transition-all border ${
              selectedCategory === null
                ? "bg-[#6B4C3B] text-white border-[#6B4C3B]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#6B4C3B] hover:text-[#6B4C3B]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2 text-sm font-medium transition-all border ${
                selectedCategory === cat.slug
                  ? "bg-[#6B4C3B] text-white border-[#6B4C3B]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#6B4C3B] hover:text-[#6B4C3B]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <LayoutGrid className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm font-medium">
              No products in this category yet.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Check back soon for new arrivals
            </p>
            <Button
              variant="outline"
              className="mt-6 border-[#6B4C3B] text-[#6B4C3B] rounded-none px-6"
              onClick={() => setSelectedCategory(null)}
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
