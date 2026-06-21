"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, LogIn, ShoppingBag, User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      router.push("/account");
    } catch (error) {
      // Error is already handled by the auth context with comprehensive validation
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-md mx-auto">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#6B4C3B] rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-light text-gray-900">KaysApparel</h1>
              <p className="text-sm text-gray-500 mt-1">Fashion for the Modern Woman</p>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5" />
                Sign In
              </CardTitle>
              <p className="text-sm text-gray-500">
                Welcome back! Please sign in to your account
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-none"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  Sign In
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">New Customer?</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/register">
                    <Button variant="outline" className="w-full rounded-none">
                      <User className="h-4 w-4 mr-2" />
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  <Link href="/forgot-password" className="text-[#6B4C3B] hover:underline">
                    Forgot your password?
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guest Checkout Option */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">
              Prefer to checkout without creating an account?
            </p>
            <Link href="/checkout">
              <Button variant="ghost" className="text-[#6B4C3B] hover:text-[#5a3f31]">
                Continue as Guest
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
