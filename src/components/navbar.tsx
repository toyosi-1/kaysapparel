"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Fragment } from "react";
import { ShoppingBag, Menu, User, Search, X, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { categories } from "@/lib/data";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Fragment>
      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-white px-4 pt-6 lg:hidden">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setSearchOpen(false)}
              className="h-10 w-10 flex items-center justify-center text-gray-700"
              aria-label="Close search"
            >
              <X className="h-6 w-6" />
            </button>
            <span className="text-sm font-medium text-gray-900">Search</span>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 text-base focus:outline-none focus:border-[#6B4C3B] focus:ring-1 focus:ring-[#6B4C3B]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </form>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="relative w-full flex h-14 items-center justify-between px-5 lg:px-12">
        {/* Left: Mobile menu */}
        <div className="flex items-center gap-4 flex-1">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-full hover:bg-stone-100 transition-colors">
              <Menu className="h-5 w-5 text-gray-700" />
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6 pt-8">
                <Image
                  src="/images/logo_cropped.png"
                  alt="KaysApparel"
                  width={180}
                  height={137}
                  className="w-40 h-auto object-contain mb-8"
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
          <nav className="hidden lg:flex items-center gap-0">
            <Link
              href="/"
              className={`relative px-5 py-2.5 text-[14px] transition-colors font-medium tracking-wide group ${
                pathname === "/" ? "text-[#6B4C3B]" : "text-gray-700 hover:text-[#6B4C3B]"
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-5 right-5 h-[2px] bg-[#6B4C3B] transition-transform duration-200 origin-left ${
                pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <Link
                href="/shop"
                className={`relative flex items-center gap-1 px-5 py-2.5 text-[14px] transition-colors font-medium tracking-wide group ${
                  pathname.startsWith("/shop") || pathname.startsWith("/product") ? "text-[#6B4C3B]" : "text-gray-700 hover:text-[#6B4C3B]"
                }`}
              >
                Shop
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${shopDropdownOpen ? "rotate-180 text-[#6B4C3B]" : ""}`} />
                <span className={`absolute bottom-0 left-5 right-5 h-[2px] bg-[#6B4C3B] transition-transform duration-200 origin-left ${
                  pathname.startsWith("/shop") || pathname.startsWith("/product") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-52 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 mt-1">
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-800 hover:text-[#6B4C3B] hover:bg-stone-50 font-semibold transition-colors"
                  >
                    All Products
                  </Link>
                  <div className="border-t border-gray-100 my-1.5 mx-3" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#6B4C3B] hover:bg-stone-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/contact"
              className={`relative px-5 py-2.5 text-[14px] transition-colors font-medium tracking-wide group ${
                pathname === "/contact" ? "text-[#6B4C3B]" : "text-gray-700 hover:text-[#6B4C3B]"
              }`}
            >
              Contact
              <span className={`absolute bottom-0 left-5 right-5 h-[2px] bg-[#6B4C3B] transition-transform duration-200 origin-left ${
                pathname === "/contact" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
          </nav>
        </div>

        {/* Center: Logo — width-driven so it is always 122px tall on desktop */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
          <Image
            src="/images/logo_cropped.png"
            alt="KaysApparel"
            width={407}
            height={310}
            className="w-[58px] sm:w-[68px] lg:w-[78px] h-auto object-contain drop-shadow-sm"
            priority
          />
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden h-11 w-11 inline-flex items-center justify-center text-gray-700 hover:text-[#6B4C3B]"
            aria-label="Search"
          >
            <Search className="h-6 w-6" />
          </button>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-48 xl:w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6B4C3B] focus:ring-1 focus:ring-[#6B4C3B] transition-all"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
          </form>

          <Link href="/wishlist" className="relative hidden sm:flex items-center justify-center h-11 w-11 rounded-full hover:bg-stone-100 text-gray-700 hover:text-[#6B4C3B] transition-all">
            <Heart className="h-6 w-6" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#6B4C3B] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/account" className="hidden sm:flex items-center justify-center h-11 w-11 rounded-full hover:bg-stone-100 text-gray-700 hover:text-[#6B4C3B] transition-all">
            <User className="h-6 w-6" />
          </Link>
          <Link href="/cart" className="relative flex items-center justify-center h-11 w-11 rounded-full hover:bg-stone-100 text-gray-700 hover:text-[#6B4C3B] transition-all">
            <ShoppingBag className="h-6 w-6" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#6B4C3B] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
    </Fragment>
  );
}
