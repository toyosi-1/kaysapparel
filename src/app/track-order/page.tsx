"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { orderService, Order } from "@/lib/firebase-services";
import { formatPrice } from "@/lib/data";
import { getDeliveryZoneInfo } from "@/lib/delivery";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  Home,
  ArrowLeft,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: Clock, color: 'text-yellow-600' },
  { status: 'paid', label: 'Payment Confirmed', icon: CheckCircle, color: 'text-green-600' },
  { status: 'processing', label: 'Processing', icon: Package, color: 'text-blue-600' },
  { status: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-600' },
  { status: 'delivered', label: 'Delivered', icon: Home, color: 'text-green-600' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState(orderId || '');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrder = async (id: string) => {
    try {
      const orderData = await orderService.getById(id);
      setOrder(orderData);
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    
    setSearching(true);
    await loadOrder(searchId.trim());
    setSearching(false);
  };

  const getCurrentStepIndex = (status: string) => {
    const index = statusSteps.findIndex(step => step.status === status);
    return index === -1 ? 0 : index;
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-500">Enter your order ID to track your delivery status</p>
          </div>

          {/* Search */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter your Order ID"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4C3B] focus:border-transparent"
              />
              <Button 
                onClick={handleSearch}
                disabled={searching || !searchId.trim()}
                className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none px-6"
              >
                {searching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Order Details */}
          {order ? (
            <div className="space-y-6">
              {/* Status Timeline */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="font-medium text-lg mb-6">Order Status</h2>
                <div className="relative">
                  <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                  {statusSteps.map((step, index) => {
                    const currentStepIndex = getCurrentStepIndex(order.status);
                    const isActive = index <= currentStepIndex;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.status} className="relative flex items-center mb-6 last:mb-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          isActive ? 'bg-[#6B4C3B]' : 'bg-gray-200'
                        }`}>
                          <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-4">
                          <p className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {index === currentStepIndex && (
                            <p className="text-sm text-gray-500">Current status</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="font-medium text-lg mb-4">Order Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-sm font-medium">{order.id}</p>
                    
                    <p className="text-sm text-gray-500 mb-1 mt-3">Order Date</p>
                    <p className="text-sm">
                      {order.createdAt?.toDate?.() ? 
                        new Date(order.createdAt.toDate()).toLocaleDateString() : 
                        'Unknown'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                    <p className="text-sm font-medium">{formatPrice(order.subtotal || 0)}</p>
                    
                    <p className="text-sm text-gray-500 mb-1 mt-3">Delivery Fee</p>
                    <p className="text-sm font-medium">{formatPrice(order.deliveryFee || 0)}</p>
                    
                    <p className="text-sm text-gray-500 mb-1 mt-3">Total Amount</p>
                    <p className="font-semibold text-lg text-[#6B4C3B]">{formatPrice(order.total)}</p>
                    
                    <p className="text-sm text-gray-500 mb-1 mt-3">Payment Method</p>
                    <p className="text-sm">Bank Transfer - Sterling Bank</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              {order.customerInfo && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="font-medium text-lg mb-4">Delivery Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {order.customerInfo.deliveryZone
                          ? getDeliveryZoneInfo(order.customerInfo.deliveryZone as any)?.label
                          : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{order.customerInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{order.customerInfo.phone}</span>
                    </div>
                    {order.customerInfo.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{order.customerInfo.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="font-medium text-lg mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.size} / {item.color} &times; {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200 mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span className="font-medium">{formatPrice(order.deliveryFee || 0)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-[#6B4C3B]">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Order Found</h3>
              <p className="text-gray-500 mb-6">
                {orderId ? "We couldn't find an order with that ID. Please check and try again." : "Enter an order ID above to track your package."}
              </p>
              <Link href="/shop">
                <Button className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
