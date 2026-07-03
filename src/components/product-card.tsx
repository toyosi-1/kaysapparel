"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, categories } from "@/lib/data";
import { Heart, ShoppingBag, Eye, Plus, X } from "lucide-react";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const NEW_PRODUCT_IDS = new Set(["9", "10", "11", "12", "13", "14", "15"]);
const POPULAR_PRODUCT_IDS = new Set(["19", "25", "26", "29", "46"]);

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0];
  const hoverImageUrl = product.images[1];
  const isExternal = imageUrl?.startsWith("http");
  const hoverIsExternal = hoverImageUrl?.startsWith("http");
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToCart = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const categoryName = categories.find((c) => c.slug === product.category)?.name ?? product.category;
  const isNew = NEW_PRODUCT_IDS.has(product.id);
  const isPopular = POPULAR_PRODUCT_IDS.has(product.id);

  useEffect(() => setMounted(true), []);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(isInWishlist ? "Removed from wishlist" : "Saved to wishlist");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    setQuickAddOpen(true);
    setSelectedSize("");
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, size, product.colors[0] || "");
    toast.success(`${product.name} (${size}) added to cart!`);
    setQuickAddOpen(false);
  };

  const handleCloseQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddOpen(false);
  };

  return (
    <div className="group w-full">
      {/* ── IMAGE BLOCK ── */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-[#F5F5F5]">
        <Link
          href={`/product/${product.id}`}
          className="absolute inset-0 block"
          aria-label={`View ${product.name}`}
        >
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className={`object-cover object-top transition-all duration-500 group-hover:scale-[1.04] ${
                  hoverImageUrl
                    ? "group-hover:opacity-0 group-hover:-translate-x-4"
                    : ""
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized={!isExternal}
                loading="lazy"
                decoding="async"
              />
              {hoverImageUrl && (
                <>
                  <Image
                    src={hoverImageUrl}
                    alt={`${product.name} - back view`}
                    fill
                    className="object-cover object-top transition-all duration-500 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized={!hoverIsExternal}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute bottom-3 left-3 bg-white/90 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Back view
                  </span>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-stone-300" />
            </div>
          )}
        </Link>

        {/* Badge */}
        {!product.inStock ? (
          <span className="absolute top-2.5 left-2.5 bg-black text-white text-[9px] font-bold px-2 py-1 tracking-widest uppercase z-10">
            SOLD OUT
          </span>
        ) : isNew ? (
          <span className="absolute top-2.5 left-2.5 bg-[#6B4C3B] text-white text-[9px] font-bold px-2 py-1 tracking-widest uppercase z-10">
            NEW
          </span>
        ) : isPopular ? (
          <span className="absolute top-2.5 left-2.5 bg-[#C4A882] text-[#2C2220] text-[9px] font-bold px-2 py-1 tracking-widest uppercase z-10">
            HOT
          </span>
        ) : null}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            mounted && isInWishlist
              ? "bg-[#6B4C3B] text-white"
              : "bg-white/80 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-[#6B4C3B]"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`h-3.5 w-3.5 ${mounted && isInWishlist ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add overlay — size picker */}
        {quickAddOpen && (
          <div
            className="absolute inset-0 bg-white/96 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30 p-4"
            onClick={handleCloseQuickAdd}
          >
            <button
              onClick={handleCloseQuickAdd}
              className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Select Size</p>
            <div className="flex flex-wrap gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeSelect(e, size)}
                  className="h-9 min-w-[2.5rem] px-3 border-2 border-[#6B4C3B] text-[#6B4C3B] text-xs font-bold hover:bg-[#6B4C3B] hover:text-white transition-colors rounded-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar: Quick view + Quick add */}
        {!quickAddOpen && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex z-20">
            <Link
              href={`/product/${product.id}`}
              className="flex items-center justify-center gap-1.5 flex-1 bg-[#2C2220] hover:bg-[#6B4C3B] text-white text-[10px] font-semibold tracking-wider py-3 transition-colors"
            >
              <Eye className="h-3 w-3" /> VIEW
            </Link>
            {product.inStock && (
              <button
                onClick={handleQuickAdd}
                className="flex items-center justify-center gap-1.5 px-4 bg-[#6B4C3B] hover:bg-[#5a3f31] text-white text-[10px] font-semibold tracking-wider py-3 transition-colors border-l border-white/20"
                aria-label="Quick add to cart"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── INFO BLOCK ── */}
      <Link href={`/product/${product.id}`} className="block pt-3 pb-4 px-1">
        <p className="text-[10px] text-[#9B8070] uppercase tracking-[0.18em] font-semibold mb-1">
          {categoryName}
        </p>
        <h3 className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-[#6B4C3B] transition-colors mb-2">
          {product.name}
        </h3>
        <p className="text-[15px] font-bold text-[#6B4C3B] mb-2">
          {formatPrice(product.price)}
        </p>
        <p className="text-[11px] text-gray-400">
          {product.sizes.join(", ")}
        </p>
      </Link>
    </div>
  );
}
