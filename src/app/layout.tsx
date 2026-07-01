import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { SiteWidgets } from "@/components/site-widgets";
import { AuthProvider } from "@/contexts/auth-context";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  metadataBase: new URL("https://kaysapparel.com"),
  icons: {
    icon: { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    apple: "/apple-touch-icon.png",
  },
  title: {
    default: "KaysApparel | Premium Women's Fashion in Nigeria",
    template: "%s | KaysApparel",
  },
  description:
    "Shop premium dresses, tops, skirts, trousers & sets for the bold Nigerian woman. Fast delivery across Lagos and all 36 states. Order online or via WhatsApp.",
  keywords: ["women's fashion Nigeria", "dresses Lagos", "online clothing store Nigeria", "KaysApparel", "women's clothing Surulere"],
  openGraph: {
    siteName: "KaysApparel",
    type: "website",
    locale: "en_NG",
    url: "https://kaysapparel.com",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <SiteWidgets />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
