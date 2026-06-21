"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { categories } from "@/lib/data";
import { getProducts } from "@/lib/data-service";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";
import { Product } from "@/lib/types";

const categoryImages: Record<string, string> = {
  dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
  tops: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop",
  skirts: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop",
  trousers: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-0 min-h-[85vh] items-center">
            {/* Text */}
            <div className="py-16 md:py-24 md:pr-12">
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-6">
                New Collection 2025
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-[1.1] tracking-tight">
                Elevate Your
                <br />
                <span className="font-semibold text-[#6B4C3B]">Personal Style</span>
              </h1>
              <p className="mt-6 text-gray-500 text-base md:text-lg max-w-md leading-relaxed">
                Curated fashion pieces for the modern woman. Quality clothing 
                delivered to your doorstep across Nigeria.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none px-8 py-6 text-sm font-medium tracking-wide">
                    SHOP NOW
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/shop?category=dresses">
                  <Button variant="outline" className="border-[#6B4C3B] text-[#6B4C3B] hover:bg-[#6B4C3B] hover:text-white rounded-none px-8 py-6 text-sm font-medium tracking-wide">
                    VIEW DRESSES
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[60vh] md:h-full min-h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop&crop=top"
                alt="Fashion model wearing elegant outfit"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent md:bg-gradient-to-r md:from-white/30 md:via-transparent md:to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-gray-100 bg-stone-50/50">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#6B4C3B]/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-[#6B4C3B]" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">Nationwide Delivery</p>
                <p className="text-xs text-gray-500 mt-0.5">We deliver across Nigeria</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#6B4C3B]/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-[#6B4C3B]" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">Easy Bank Transfer</p>
                <p className="text-xs text-gray-500 mt-0.5">Simple payment via transfer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#6B4C3B]/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-[#6B4C3B]" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">Quality Guaranteed</p>
                <p className="text-xs text-gray-500 mt-0.5">Premium fabrics & materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories with Images */}
      <section className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-2">Categories</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900">Shop by Category</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex text-sm text-[#6B4C3B] hover:underline items-center gap-1 font-medium"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden"
            >
              <Image
                src={categoryImages[cat.slug] || categoryImages.dresses}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <p className="text-white/70 text-[10px] uppercase tracking-widest mb-1">
                  {products.filter((p) => p.category === cat.slug).length} items
                </p>
                <h3 className="text-white font-medium text-base md:text-lg">
                  {cat.name}
                </h3>
              </div>
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-3.5 w-3.5 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-stone-50/50">
        <div className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-2">Just In</p>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">New Arrivals</h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex text-sm text-[#6B4C3B] hover:underline items-center gap-1 font-medium"
            >
              See All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="sm:hidden text-center mt-8">
            <Link href="/shop">
              <Button variant="outline" className="rounded-none border-[#6B4C3B] text-[#6B4C3B] px-8">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lookbook / Banner */}
      <section className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
        <div className="relative overflow-hidden rounded-lg h-[50vh] md:h-[60vh] min-h-[350px]">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=600&fit=crop"
            alt="Fashion lookbook"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <p className="text-white/70 text-xs uppercase tracking-[0.3em] mb-4">The Collection</p>
            <h2 className="text-white text-3xl md:text-5xl font-light leading-tight max-w-xl">
              Ready to Upgrade Your Wardrobe?
            </h2>
            <p className="mt-4 text-white/60 max-w-md text-sm md:text-base">
              Browse our latest collection. Trendy styles at prices you&apos;ll love.
            </p>
            <Link href="/shop" className="mt-8">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-none px-8 py-6 text-sm font-medium tracking-wide">
                EXPLORE COLLECTION
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
