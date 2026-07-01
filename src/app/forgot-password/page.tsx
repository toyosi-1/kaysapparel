"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ArrowLeft, Mail, CheckCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: any) {
      const code = err?.code;
      if (code === "auth/user-not-found") {
        toast.error("No account found with that email address.");
      } else if (code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-md mx-auto">
          {/* Brand */}
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
                <Mail className="h-5 w-5" />
                Reset Password
              </CardTitle>
              <p className="text-sm text-gray-500">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Check your inbox</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    We sent a password reset link to <span className="font-medium text-gray-900">{email}</span>.
                    Check your spam folder if you don&apos;t see it.
                  </p>
                  <Link href="/login">
                    <Button className="w-full bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none mt-2">
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              ) : (
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
                  <Button
                    type="submit"
                    className="w-full bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Send Reset Link
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-[#6B4C3B] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
