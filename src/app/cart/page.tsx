"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Lock } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-2">Cart</p>
            <h1 className="text-2xl md:text-3xl font-light text-gray-900">Your cart is empty</h1>
            <p className="text-gray-400 mt-2 text-sm">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link href="/shop">
              <Button className="mt-8 gap-2 bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none px-8" size="lg">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B4C3B] font-medium mb-2">Cart</p>
            <h1 className="text-2xl md:text-3xl font-light text-gray-900">Shopping Cart</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {items.reduce((c, i) => c + i.quantity, 0)} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <Link href="/shop" className="text-sm text-[#6B4C3B] hover:underline font-medium hidden sm:block">
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4 p-4 md:p-5 bg-white border border-gray-100 rounded-lg"
              >
                {/* Product thumbnail */}
                <div className="w-20 h-24 md:w-24 md:h-28 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {item.product.images[0]?.startsWith("http") ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-sm md:text-base text-gray-900">{item.product.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Size: <span className="font-medium text-gray-600">{item.size}</span> • Color: <span className="font-medium text-gray-600">{item.color}</span>
                      </p>
                    </div>
                    <p className="font-semibold text-sm md:text-base text-[#6B4C3B] whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>

                  <p className="text-gray-400 text-sm mt-2">
                    {formatPrice(item.product.price)} each
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="h-9 w-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="h-9 w-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        removeItem(item.product.id, item.size, item.color)
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 sticky top-28">
              <h2 className="font-medium text-lg mb-5">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Subtotal ({items.reduce((c, i) => c + i.quantity, 0)} items)
                  </span>
                  <span className="font-medium text-gray-900">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span className="text-gray-400 text-xs">
                    Calculated at checkout
                  </span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-medium text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#6B4C3B]">{formatPrice(getTotal())}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="w-full mt-6 gap-2 bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none h-12 font-medium" size="lg">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
                <Lock className="h-3 w-3" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
