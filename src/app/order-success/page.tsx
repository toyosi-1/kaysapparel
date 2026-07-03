"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Package, MapPin, Phone, Mail } from "lucide-react";
import { orderService, Order } from "@/lib/firebase-services";
import { formatPrice } from "@/lib/data";
import { getDeliveryZoneInfo } from "@/lib/delivery";
import { getLastOrder } from "@/lib/order-service";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Show cached order immediately so the page feels instant
    const cachedOrder = getLastOrder();
    if (cachedOrder && cachedOrder.id === orderId) {
      setOrder(cachedOrder);
      setLoading(false);
    }

    // Fetch fresh data in the background to update if anything changed
    const loadOrder = async () => {
      try {
        const orderData = await orderService.getById(orderId);
        if (orderData) {
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Thank you for your order. We have received your payment receipt and
            will verify it shortly. You will receive a confirmation once your
            payment is verified.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-[#6B4C3B]" />
                <h2 className="font-medium text-lg">Order Details</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono text-sm font-medium">{order.id}</p>
                  
                  <p className="text-sm text-gray-500 mb-1 mt-3">Status</p>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    {order.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                  <p className="text-sm font-medium">{formatPrice(order.subtotal || 0)}</p>
                  
                  <p className="text-sm text-gray-500 mb-1 mt-3">Delivery Fee</p>
                  <p className="text-sm font-medium">{formatPrice(order.deliveryFee || 0)}</p>
                  
                  <p className="text-sm text-gray-500 mb-1 mt-3">Total Amount</p>
                  <p className="font-semibold text-lg text-[#6B4C3B]">{formatPrice(order.total)}</p>
                  
                  <p className="text-sm text-gray-500 mb-1 mt-3">Payment Method</p>
                  <p className="text-sm">Bank Transfer — Moniepoint MFB</p>
                </div>
              </div>

              {order.customerInfo && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium mb-3">Delivery Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>
                        {order.customerInfo.deliveryZone
                          ? getDeliveryZoneInfo(order.customerInfo.deliveryZone as any)?.label
                          : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{order.customerInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{order.customerInfo.phone}</span>
                    </div>
                    {order.customerInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{order.customerInfo.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium mb-2">What happens next?</p>
            <ol className="text-sm text-gray-600 text-left space-y-2">
              <li>1. We verify your payment receipt</li>
              <li>2. You get a confirmation notification</li>
              <li>3. Your order is prepared and shipped</li>
              <li>4. Delivery to your address</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop">
              <Button variant="outline" className="gap-2 rounded-none">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/track-order?orderId=${orderId}`}>
              <Button className="gap-2 bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none">
                Track Your Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
