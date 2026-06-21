"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";
import { categories } from "@/lib/data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white"
      }`}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-4 lg:px-8">
        {/* Left: Mobile menu */}
        <div className="flex items-center gap-4 flex-1">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center h-10 w-10">
              <Menu className="h-5 w-5 text-gray-700" />
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6 pt-8">
                <Image
                  src="/images/logo.jpeg"
                  alt="KaysApparel"
                  width={140}
                  height={50}
                  className="h-12 w-auto object-contain mix-blend-multiply mb-8"
                />
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/"
                    className="py-3 px-3 text-sm font-medium text-gray-900 hover:text-[#6B4C3B] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    className="py-3 px-3 text-sm font-medium text-gray-900 hover:text-[#6B4C3B] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Shop All
                  </Link>
                  <div className="border-t my-3" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest px-3 mb-2 font-medium">
                    Categories
                  </p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      className="py-2.5 px-3 text-sm text-gray-600 hover:text-[#6B4C3B] transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-700 hover:text-[#6B4C3B] transition-colors font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-sm text-gray-700 hover:text-[#6B4C3B] transition-colors font-medium">
              Shop
            </Link>
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="text-sm text-gray-500 hover:text-[#6B4C3B] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.jpeg"
            alt="KaysApparel"
            width={200}
            height={70}
            className="h-16 md:h-20 w-auto object-contain mix-blend-multiply"
            priority
          />
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <Link href="/account">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-700 hover:text-[#6B4C3B]">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-700 hover:text-[#6B4C3B]">
              <ShoppingBag className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-[#6B4C3B] text-white flex items-center justify-center text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
