"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { categories, products as staticProducts } from "@/lib/data";
import { firebaseProducts } from "@/lib/firebase-products";
import { productService } from "@/lib/firebase-services";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, CreditCard, Star } from "lucide-react";
import { Product } from "@/lib/types";

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

const categoryFallbackImages: Record<string, string> = {
  dresses: "/images/products/teal-floral-mesh-maxi-dress.webp",
  tops: "/images/products/rust-beaded-shoulder-blouse.webp",
  skirts: "/images/products/grey-satin-mermaid-midi-skirt.webp",
  trousers: "/images/products/beige-tailored-wide-leg-trouser.webp",
  shorts: "/images/products/pink-stripe-oversized-shirt-set.webp",
  "two-piece-sets": "/images/products/abstract-print-pant-set.webp",
  accessories: "/images/products/grey-chain-strap-handbag.webp",
};

function getCategoryImage(slug: string, products: Product[]) {
  const product = products.find((p) => p.category === slug);
  return product?.images[0] || categoryFallbackImages[slug] || categoryFallbackImages.dresses;
}

function HeroCarousel({ products }: { products: Product[] }) {
  const [current, setCurrent] = useState(0);
  const slides = products.slice(0, 5);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-full w-full bg-stone-100 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-stone-100">
      {slides.map((product, index) => (
        <Link
          key={product.id}
          href={`/product?id=${product.id}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-top"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            decoding={index === 0 ? "sync" : "async"}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
            <p className="text-white/80 text-xs uppercase tracking-widest mb-1">Featured</p>
            <h3 className="text-white text-lg md:text-xl font-medium leading-snug line-clamp-2">{product.name}</h3>
            <p className="text-white/90 text-sm mt-1">{product.price.toLocaleString()} NGN</p>
          </div>
        </Link>
      ))}

      {/* Controls */}
      <button
        onClick={(e) => { e.preventDefault(); setCurrent((prev) => (prev - 1 + slides.length) % slides.length); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); setCurrent((prev) => (prev + 1) % slides.length); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.preventDefault(); setCurrent(index); }}
            className={`h-2 rounded-full transition-all ${index === current ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  // Start with static + synced Firebase products so everything appears instantly
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Subscribe to real-time Firebase product updates so admin edits reflect instantly
  useEffect(() => {
    const unsubscribe = productService.subscribeToAll((firebaseProducts) => {
      setProducts(mergeProductCatalog(staticProducts, firebaseProducts));
    });
    return () => unsubscribe();
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="bg-white">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 min-h-[70vh] md:min-h-[88vh] items-center py-10 md:py-0">

            {/* Text */}
            <div className="py-10 md:py-20 md:pr-8 order-2 md:order-1">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B4C3B] font-bold mb-6 flex items-center gap-3">
                <span className="inline-block w-10 h-px bg-[#6B4C3B]" />
                New Season · New You
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.08] tracking-tight">
                Dress Like the
                <br />
                <span className="text-[#6B4C3B]">Woman You Are</span>
              </h1>

              <p className="mt-6 text-gray-500 text-base md:text-lg max-w-[420px] leading-relaxed">
                Premium dresses, tops, skirts & sets curated for the bold, stylish Nigerian woman. Fast delivery across Lagos & nationwide.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/shop">
                  <Button className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-full px-9 h-12 text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all">
                    Shop The Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/2348136642570" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#6B4C3B] flex items-center gap-1.5 hover:gap-2.5 transition-all">
                  Order via WhatsApp <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-10 flex items-center gap-8 border-t border-gray-100 pt-8">
                {[
                  { value: "41+", label: "Styles" },
                  { value: "7", label: "Categories" },
                  { value: "5.0★", label: "Rating" },
                ].map((stat, i) => (
                  <div key={i} className={`text-center ${i > 0 ? "border-l border-gray-100 pl-8" : ""}`}>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel */}
            <div className="relative h-[50vh] sm:h-[60vh] md:h-[82vh] min-h-[340px] order-1 md:order-2">
              <HeroCarousel products={products} />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-y border-gray-100 bg-[#FAF8F6]">
        <div className="max-w-7xl mx-auto px-5 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              { icon: <Truck className="h-5 w-5 text-[#6B4C3B]" />, title: "Nationwide Delivery", sub: "Lagos & across all 36 states" },
              { icon: <CreditCard className="h-5 w-5 text-[#6B4C3B]" />, title: "Easy Bank Transfer", sub: "Moniepoint MFB · instant confirmation" },
              { icon: <Shield className="h-5 w-5 text-[#6B4C3B]" />, title: "Quality Guaranteed", sub: "Premium fabrics, always" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5 md:py-6">
                <div className="h-11 w-11 rounded-xl bg-[#6B4C3B]/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-5 lg:px-12 py-16 md:py-24">
        <div className="mb-10">
          <div className="bg-[#6B4C3B] rounded-lg p-5 md:p-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/70 font-bold mb-1">Browse</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Shop by Category</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex text-sm text-white hover:text-white/80 items-center gap-1 font-medium">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.filter((cat) => products.some((p) => p.category === cat.slug)).slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden block"
            >
              <Image
                src={getCategoryImage(cat.slug, products)}
                alt={cat.name}
                fill
                loading="lazy"
                decoding="async"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">
                  {products.filter((p) => p.category === cat.slug).length} items
                </p>
                <h3 className="text-white font-semibold text-base md:text-lg leading-snug">
                  {cat.name}
                </h3>
              </div>
              <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-white/30">
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-12 py-16 md:py-24">
          <div className="mb-10">
            <div className="bg-[#6B4C3B] rounded-lg p-5 md:p-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/70 font-bold mb-1">Just In</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">New Arrivals</h2>
              </div>
              <Link href="/shop" className="hidden sm:flex text-sm text-white hover:text-white/80 items-center gap-1 font-medium">
                See All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/shop">
              <Button variant="outline" className="rounded-full border-[#6B4C3B] text-[#6B4C3B] hover:bg-[#6B4C3B] hover:text-white px-10 h-11 transition-all">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#2C2220] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C4A882] font-bold mb-3">Happy Customers</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Adaeze M.", location: "Lagos", text: "I ordered the teal maxi dress and received it in 2 days. The quality is absolutely stunning — everyone keeps asking where I got it!", stars: 5 },
              { name: "Funmi A.", location: "Abuja", text: "KaysApparel never disappoints. The fabrics are premium and the sizing is perfect. My go-to store for every occasion.", stars: 5 },
              { name: "Ngozi O.", location: "Port Harcourt", text: "Ordered the abstract print set for my birthday dinner. Got so many compliments! Fast delivery and the packaging was beautiful.", stars: 5 },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-white/[0.06] border border-white/10 rounded-2xl p-7 flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(review.stars)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#C4A882] text-[#C4A882]" />
                  ))}
                </div>
                <p className="text-white/75 text-sm leading-[1.8] mb-6 flex-1">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className="h-10 w-10 rounded-full bg-[#6B4C3B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{review.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/shop">
              <Button className="bg-[#C4A882] hover:bg-[#b8986e] text-[#2C2220] rounded-full px-10 h-12 text-sm font-bold tracking-wide transition-all">
                Shop The Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
