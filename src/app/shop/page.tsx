"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { categories, products as staticProducts } from "@/lib/data";
import { firebaseProducts } from "@/lib/firebase-products";
import { productService } from "@/lib/firebase-services";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Product } from "@/lib/types";

type SortOption = "featured" | "price-low" | "price-high" | "name";

function mergeProductCatalog(staticList: Product[], firebaseList: Product[]): Product[] {
  const merged = [...staticList];
  for (const product of firebaseList) {
    const index = merged.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      merged[index] = product;
    } else {
      merged.push(product);
    }
  }
  return merged;
}

const initialProducts = mergeProductCatalog(staticProducts, firebaseProducts);

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const searchQueryParam = searchParams.get("search");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam
  );
  const [searchQuery, setSearchQuery] = useState(searchQueryParam || "");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  // Start with static + synced Firebase products so everything appears instantly
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  // Refresh from Firebase in the background to catch any newer changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await Promise.race([
          productService.getAll() as Promise<Product[]>,
          new Promise<Product[]>((_, reject) =>
            setTimeout(() => reject(new Error("Firebase fetch timed out")), 3000)
          ),
        ]);
        setAllProducts(mergeProductCatalog(staticProducts, fetchedProducts));
      } catch (error) {
        console.error("Failed to load products:", error);
        // Synced products are already showing, no need to block UI
      }
    };

    loadProducts();
  }, []);

  const allColors = useMemo(
    () => Array.from(new Set(allProducts.flatMap((p) => p.colors || []))).sort(),
    [allProducts]
  );
  const allSizes = useMemo(
    () => Array.from(new Set(allProducts.flatMap((p) => p.sizes || []))).sort(),
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    let list = selectedCategory
      ? allProducts.filter((p) => p.category === selectedCategory)
      : [...allProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    const min = priceMin ? parseInt(priceMin) : 0;
    const max = priceMax ? parseInt(priceMax) : Infinity;
    list = list.filter((p) => p.price >= min && p.price <= max);

    if (selectedColor) {
      list = list.filter((p) =>
        (p.colors || []).some((c) => c.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    if (selectedSize) {
      list = list.filter((p) => (p.sizes || []).includes(selectedSize));
    }

    if (sortBy === "price-low") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "name") return list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [allProducts, selectedCategory, searchQuery, priceMin, priceMax, selectedColor, selectedSize, sortBy]);

  // Update selected category and search query when URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchQuery(searchQueryParam || "");
  }, [categoryParam, searchQueryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchQuery.trim() || null });
  };

  const updateUrl = (updates: { category?: string | null; search?: string | null }) => {
    const params = new URLSearchParams();
    if (updates.category) params.set("category", updates.category);
    if (updates.search) params.set("search", updates.search);
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    setSortBy("featured");
    setPriceMin("");
    setPriceMax("");
    setSelectedColor(null);
    setSelectedSize(null);
    setSearchQuery("");
    router.push("/shop");
  };

  const activeFilters =
    (sortBy !== "featured" ? 1 : 0) +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (selectedSize ? 1 : 0);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10 md:py-14">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-2">
            {selectedCategory ? "Category" : searchQuery ? "Search Results" : "All Products"}
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-gray-900">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || "Shop"
              : searchQuery
              ? `Search: "${searchQuery}"`
              : "Shop All"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search + Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dresses, tops, colors..."
              className="w-full h-11 rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm focus:outline-none focus:border-[#6B4C3B] focus:ring-1 focus:ring-[#6B4C3B]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="h-11 px-4 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-[#6B4C3B] hover:text-[#6B4C3B] flex items-center gap-2 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <span className="h-5 w-5 rounded-full bg-[#6B4C3B] text-white text-[10px] flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 pl-4 pr-10 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:border-[#6B4C3B] appearance-none cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-5 border border-gray-100 rounded-xl bg-stone-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min"
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#6B4C3B]"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max"
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#6B4C3B]"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Color</label>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                        selectedColor === color
                          ? "bg-[#6B4C3B] text-white border-[#6B4C3B]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#6B4C3B]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Size</label>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`h-9 w-10 text-xs font-medium rounded border transition-colors ${
                        selectedSize === size
                          ? "bg-[#6B4C3B] text-white border-[#6B4C3B]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#6B4C3B]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="mt-5 text-xs font-medium text-[#6B4C3B] hover:underline flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-gray-100">
          <button
            onClick={() => updateUrl({ category: null })}
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
              onClick={() => updateUrl({ category: cat.slug })}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-[3/4] rounded-2xl mb-3"></div>
                <div className="h-4 bg-gray-100 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {filteredProducts.map((product) => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <LayoutGrid className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm font-medium">
              No products match your filters.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              className="mt-6 border-[#6B4C3B] text-[#6B4C3B] rounded-none px-6"
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10 md:py-14">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
