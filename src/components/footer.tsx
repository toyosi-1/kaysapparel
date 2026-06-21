import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/data";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2C2220] text-white mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <div className="bg-[#2C2220] inline-block">
              <Image
                src="/images/logo.jpeg"
                alt="KaysApparel Fashion Store"
                width={180}
                height={65}
                className="h-16 w-auto object-contain mix-blend-lighten"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Your go-to fashion store for stylish, affordable, and trendy
              clothing delivered across Nigeria.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/kaysapparel"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2C2220] transition-all text-white/70"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/kaysapparel"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2C2220] transition-all text-white/70"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://tiktok.com/@kaysapparel"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2C2220] transition-all text-white/70"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.79a4.85 4.85 0 01-1-.1z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/shop" className="text-sm text-white/70 hover:text-white transition-colors">
                Shop All
              </Link>
              <Link href="/account" className="text-sm text-white/70 hover:text-white transition-colors">
                My Account
              </Link>
              <Link href="/cart" className="text-sm text-white/70 hover:text-white transition-colors">
                Cart
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Categories
            </h4>
            <nav className="flex flex-col gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-[#C4A882] flex-shrink-0 mt-0.5" />
                <span>Shop 45 Omololu Road, off Randle Avenue, Surulere, Lagos</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="h-4 w-4 text-[#C4A882] flex-shrink-0" />
                <span>08136642570</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="h-4 w-4 text-[#C4A882] flex-shrink-0" />
                <span>kays.apparel@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} KaysApparel. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
