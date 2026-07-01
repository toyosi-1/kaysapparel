import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Us | KaysApparel Fashion Store",
  description: "Get in touch with KaysApparel. Visit our store in Surulere, Lagos or reach us on WhatsApp, phone, or email.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-2">
            Get in Touch
          </p>
          <h1 className="text-2xl md:text-4xl font-light text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            Have a question about sizing, an order, or just want to say hello? We&apos;re happy to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <a
            href="https://wa.me/2348136642570"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 md:p-8 border border-gray-100 rounded-xl hover:border-[#6B4C3B]/30 hover:shadow-sm transition-all group"
          >
            <div className="h-12 w-12 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-5">
              <MessageCircle className="h-6 w-6 text-[#25D366]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-sm text-gray-500 mb-4">Fastest response for orders & enquiries</p>
            <p className="text-sm font-medium text-[#6B4C3B] group-hover:underline">+234 813 664 2570</p>
          </a>

          <div className="p-6 md:p-8 border border-gray-100 rounded-xl">
            <div className="h-12 w-12 rounded-full bg-[#6B4C3B]/10 flex items-center justify-center mb-5">
              <Phone className="h-6 w-6 text-[#6B4C3B]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
            <p className="text-sm text-gray-500 mb-4">Call us during business hours</p>
            <p className="text-sm font-medium text-[#6B4C3B]">+234 813 664 2570</p>
          </div>

          <div className="p-6 md:p-8 border border-gray-100 rounded-xl">
            <div className="h-12 w-12 rounded-full bg-[#6B4C3B]/10 flex items-center justify-center mb-5">
              <Mail className="h-6 w-6 text-[#6B4C3B]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-500 mb-4">Send us an email anytime</p>
            <p className="text-sm font-medium text-[#6B4C3B]">kays.apparel@gmail.com</p>
          </div>

          <div className="p-6 md:p-8 border border-gray-100 rounded-xl md:col-span-2 lg:col-span-2">
            <div className="h-12 w-12 rounded-full bg-[#6B4C3B]/10 flex items-center justify-center mb-5">
              <MapPin className="h-6 w-6 text-[#6B4C3B]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Store Address</h3>
            <p className="text-sm text-gray-500 mb-4">
              Shop 45 Omololu Road, off Randle Avenue, Surulere, Lagos, Nigeria
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Shop+45+Omololu+Road,+off+Randle+Avenue,+Surulere,+Lagos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-[#6B4C3B] text-[#6B4C3B] rounded-none hover:bg-[#6B4C3B] hover:text-white">
                Open in Maps
              </Button>
            </a>
          </div>

          <div className="p-6 md:p-8 border border-gray-100 rounded-xl">
            <div className="h-12 w-12 rounded-full bg-[#6B4C3B]/10 flex items-center justify-center mb-5">
              <Clock className="h-6 w-6 text-[#6B4C3B]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Business Hours</h3>
            <p className="text-sm text-gray-500">Mon - Sat: 9am - 7pm</p>
            <p className="text-sm text-gray-500">Sunday: Closed</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-12 text-center">
          <p className="text-sm text-gray-500">
            Follow us on{" "}
            <a href="https://facebook.com/kaysapparel" target="_blank" rel="noopener noreferrer" className="text-[#6B4C3B] font-medium hover:underline">Facebook</a>,{" "}
            <a href="https://www.instagram.com/kaysapparel" target="_blank" rel="noopener noreferrer" className="text-[#6B4C3B] font-medium hover:underline">Instagram</a>, and{" "}
            <a href="https://tiktok.com/@kaysapparel" target="_blank" rel="noopener noreferrer" className="text-[#6B4C3B] font-medium hover:underline">TikTok</a>{" "}
            for new arrivals and style inspiration.
          </p>
        </div>
      </div>
    </div>
  );
}
