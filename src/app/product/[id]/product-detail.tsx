"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice, categories } from "@/lib/data";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Truck, RotateCcw, Shield, ArrowLeft, FlipHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ProductReviews } from "@/components/product-reviews";
import { RecentlyViewed } from "@/components/recently-viewed";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { SizeGuide } from "@/components/size-guide";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const categoryName = categories.find((c) => c.slug === product.category)?.name ?? product.category;

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);

  const goToNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const goToPrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const isBackView = selectedImage === 1 && product.images.length > 1;
  const toggleFrontBack = () => {
    setSelectedImage((prev) => (prev === 0 ? 1 : 0));
  };

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product.id]);

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
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[2/3] bg-white rounded-2xl overflow-hidden flex items-center justify-center relative">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={isBackView ? `${product.name} - back view` : product.name}
                fill
                priority
                className="object-contain transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={!product.images[selectedImage].startsWith("http")}
              />
            ) : (
              <div className="text-center p-8">
                <div className="w-28 h-28 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-primary/50" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">{product.name}</p>
              </div>
            )}
            {!product.inStock && (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="rounded-full">Sold Out</Badge>
              </div>
            )}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 bg-white/90 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md text-gray-600 pointer-events-none">
                {isBackView ? "Back view" : "Front view"}
              </div>
            )}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-[#6B4C3B] hover:text-white text-[#6B4C3B] shadow-sm flex items-center justify-center transition-colors z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-[#6B4C3B] hover:text-white text-[#6B4C3B] shadow-sm flex items-center justify-center transition-colors z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleFrontBack}
                className="gap-2 rounded-none border-[#6B4C3B] text-[#6B4C3B] hover:bg-[#6B4C3B] hover:text-white"
              >
                <FlipHorizontal className="h-4 w-4" />
                {isBackView ? "Show Front" : "Show Back"}
              </Button>
            </div>
          )}

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-[#6B4C3B]"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - view ${index + 1}`}
                    fill
                    loading="lazy"
                    decoding="async"
                    className="object-cover"
                    sizes="80px"
                    unoptimized={!img.startsWith("http")}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <Link href="/shop">
            <Button variant="outline" className="gap-2 rounded-none border-[#6B4C3B] text-[#6B4C3B] hover:bg-[#6B4C3B] hover:text-white px-4 mb-2">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {categoryName}
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
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold">
                Size{" "}
                {selectedSize && (
                  <span className="text-primary font-medium">— {selectedSize}</span>
                )}
              </label>
              <SizeGuide sizes={product.sizes} />
            </div>
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

          {/* Add to Cart + WhatsApp Share */}
          <div className="pt-2 space-y-3">
            <Button
              size="lg"
              className="w-full gap-2 rounded-xl h-13 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingBag className="h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <a
              href={`https://wa.me/2348136642570?text=${encodeURIComponent(`Hi! I'm interested in this item:\n\n*${product.name}*\nPrice: ${formatPrice(product.price)}\n\nhttps://kaysapparel.com/product/${product.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border-2 border-[#25D366] text-[#25D366] text-sm font-semibold hover:bg-[#25D366] hover:text-white transition-all"
            >
              <svg viewBox="0 0 360 362" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0"><path fill="currentColor" fillRule="evenodd" d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234Z" clipRule="evenodd"/></svg>
              Order via WhatsApp
            </a>
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

      <ProductReviews productId={product.id} productName={product.name} />
      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
