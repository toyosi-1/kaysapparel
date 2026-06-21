"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatPrice, BANK_DETAILS } from "@/lib/data";
import { createOrder, CustomerInfo } from "@/lib/order-service";
import { receiptService } from "@/lib/firebase-services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Copy,
  Check,
  Upload,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">No items to checkout</h1>
          <p className="text-muted-foreground mt-2">
            Add items to your cart first.
          </p>
          <Link href="/shop">
            <Button className="mt-6">Go to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receipt) {
      toast.error("Please upload your payment receipt");
      return;
    }

    setSubmitting(true);

    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const customerInfo: CustomerInfo = {
        firstName,
        lastName,
        email: formData.email || '',
        phone: formData.phone,
        address: formData.address
      };

      // Create order in Firebase - now includes comprehensive validation
      const order = await createOrder(customerInfo);
      
      // Upload receipt to Firebase Storage
      if (receipt && order.id) {
        try {
          await receiptService.upload(order.id, receipt);
          toast.success("Receipt uploaded successfully!");
        } catch (receiptError) {
          console.error('Receipt upload error:', receiptError);
          toast.error("Order placed but receipt upload failed. Please contact support.");
        }
      }

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-success?orderId=${order.id}`);
    } catch (error: any) {
      console.error('Order submission error:', error);
      // Validation errors are now handled by the server with specific messages
      const errorMessage = error.message || "Failed to place order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-sm text-muted-foreground mb-8">Complete your order details below</p>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column - Customer Info + Receipt */}
          <div className="lg:col-span-3 space-y-6">
            {/* Customer Details */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <h2 className="font-bold text-base mb-5">Delivery Details</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="080XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full delivery address (street, city, state)"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                    className="rounded-xl min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Payment - Bank Details */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-base">Bank Transfer Payment</h2>
                  <p className="text-xs text-muted-foreground">Transfer to the account below</p>
                </div>
              </div>
              <div className="bg-background rounded-xl p-5 border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Bank</span>
                  <span className="font-semibold text-sm">
                    {BANK_DETAILS.bankName}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Account Name
                  </span>
                  <span className="font-semibold text-sm">
                    {BANK_DETAILS.accountName}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Account Number
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-wider">
                      {BANK_DETAILS.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={copyAccountNumber}
                      className="p-2 rounded-lg hover:bg-muted transition-colors border"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center bg-primary/5 -mx-5 -mb-5 px-5 py-4 rounded-b-xl">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Amount to Pay
                  </span>
                  <span className="font-bold text-primary text-xl">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Upload */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Upload className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h2 className="font-bold text-base">Payment Receipt</h2>
                  <p className="text-xs text-muted-foreground">Upload proof of your bank transfer</p>
                </div>
              </div>
              <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                  className="hidden"
                  id="receipt-upload"
                />
                <label
                  htmlFor="receipt-upload"
                  className="cursor-pointer block"
                >
                  {receipt ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-sm font-semibold text-green-600">
                        {receipt.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold">
                        Click to upload receipt
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 sticky top-28">
              <h2 className="font-bold text-base mb-5">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex justify-between items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size} / {item.color} &times; {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-xs text-muted-foreground">To be confirmed</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(getTotal())}</span>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-6 gap-2 rounded-xl h-12 font-semibold shadow-md"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Placing Order..." : "Confirm Order"}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground mt-4 leading-relaxed">
                By placing your order, you confirm that you have made the
                payment and uploaded the correct receipt.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
