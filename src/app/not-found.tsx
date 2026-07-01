import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-8 bg-[#6B4C3B]/10 rounded-full flex items-center justify-center">
          <ShoppingBag className="h-9 w-9 text-[#6B4C3B]" />
        </div>

        <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B4C3B] font-bold mb-3">
          404 — Page Not Found
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Oops, this page<br />doesn&apos;t exist
        </h1>
        <p className="text-gray-500 text-base mb-10 leading-relaxed">
          The page you&apos;re looking for may have been moved or removed.
          Let&apos;s get you back to something beautiful.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shop">
            <Button className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-full px-8 h-11 font-semibold">
              Shop the Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full px-8 h-11 border-gray-200 text-gray-700">
              Go to Homepage
            </Button>
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          Need help?{" "}
          <a
            href="https://wa.me/2348136642570"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B4C3B] hover:underline"
          >
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
