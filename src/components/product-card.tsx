"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0];
  const isExternal = imageUrl?.startsWith("http");

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
          {isExternal ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
              <ShoppingBag className="h-8 w-8 text-stone-300" />
            </div>
          )}

          {/* Sold out overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <Badge className="bg-white text-black font-medium rounded-full px-3 py-1 text-xs">
                Sold Out
              </Badge>
            </div>
          )}

          {/* Wishlist button */}
          <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110">
            <Heart className="h-3.5 w-3.5 text-gray-600" />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-black text-white text-center py-2.5 rounded-lg text-xs font-medium hover:bg-black/90 transition-colors cursor-pointer">
              Add to Cart
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 md:p-4">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-medium mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-sm text-gray-900 line-clamp-1 group-hover:text-[#6B4C3B] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="font-semibold text-[#6B4C3B]">
              {formatPrice(product.price)}
            </p>
            <div className="flex gap-1">
              {product.sizes.slice(0, 3).map((size) => (
                <span
                  key={size}
                  className="text-[9px] bg-gray-100 rounded px-1.5 py-0.5 text-gray-500 font-medium"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
