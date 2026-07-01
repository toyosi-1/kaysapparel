"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function SiteWidgets() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-28 right-5 z-50 h-10 w-10 rounded-full bg-white text-[#6B4C3B] shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
