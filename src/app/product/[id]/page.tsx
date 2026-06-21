"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductById, formatPrice } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowLeft, Check, Truck, RotateCcw, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(id);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mt-2">This item may have been removed or is no longer available.</p>
        <Link href="/shop">
          <Button className="mt-6 rounded-full">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addItem(product, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted rounded-2xl overflow-hidden flex items-center justify-center relative">
            <div className="text-center p-8">
              <div className="w-28 h-28 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-primary/50" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">{product.name}</p>
            </div>
            {!product.inStock && (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="rounded-full">Sold Out</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {product.category}
              </span>
              {product.inStock && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  In Stock
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mt-4">
              {formatPrice(product.price)}
            </p>
          </div>

          <Separator />

          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {product.description}
          </p>

          {/* Size Selection */}
          <div>
            <label className="text-sm font-semibold mb-3 block">
              Size{" "}
              {selectedSize && (
                <span className="text-primary font-medium">— {selectedSize}</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 min-w-[2.75rem] px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-sm font-semibold mb-3 block">
              Color{" "}
              {selectedColor && (
                <span className="text-primary font-medium">— {selectedColor}</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-11 px-5 rounded-xl border-2 text-sm font-semibold transition-all ${
                    selectedColor === color
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="pt-2">
            <Button
              size="lg"
              className="w-full gap-2 rounded-xl h-13 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingBag className="h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              <span>Fast delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Quality assured</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="h-4 w-4 text-primary" />
              <span>Easy returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
