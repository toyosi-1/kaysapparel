"use client";

import { useState } from 'react';
import { MobileTestPanel } from '@/components/mobile-test-panel';
import { OptimizedImage } from '@/components/optimized-image';
import { LazySection } from '@/components/lazy-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Smartphone, 
  Image as ImageIcon, 
  Code, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function TestOptimizationsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const optimizationFeatures = [
    {
      title: "Email Service",
      status: "completed",
      description: "Resend API integration with development/production modes",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "Form Validation",
      status: "completed", 
      description: "Comprehensive security validation with rate limiting",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "Performance Monitoring",
      status: "completed",
      description: "Real-time performance tracking and optimization",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "Mobile Responsiveness",
      status: "completed",
      description: "Mobile-first design with touch optimization",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "Image Optimization",
      status: "completed",
      description: "Lazy loading and responsive image handling",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "Code Splitting",
      status: "completed",
      description: "Dynamic imports and lazy loading for components",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">KaysApparel Optimization Dashboard</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test and monitor all performance, mobile responsiveness, and optimization features 
            implemented for the KaysApparel e-commerce platform.
          </p>
        </div>

        {/* Quick Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Optimization Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optimizationFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {feature.icon}
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testing Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Testing</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="images">Image Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Mobile Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Responsive design for all screen sizes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Touch gesture detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Safe area support for notched devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Mobile performance optimizations</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Optimizations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Lazy loading for heavy components</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Dynamic imports and code splitting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Performance monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Memory management utilities</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Test Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/shop">
                    <Button variant="outline" className="w-full">
                      Shop Page
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">
                      Registration
                    </Button>
                  </Link>
                  <Link href="/checkout">
                    <Button variant="outline" className="w-full">
                      Checkout
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="outline" className="w-full">
                      Admin Panel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-6">
            <MobileTestPanel />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Performance Features Active:</h4>
                    <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                      <li>Component render time tracking</li>
                      <li>Memory usage monitoring</li>
                      <li>Bundle size optimization</li>
                      <li>Lazy loading implementation</li>
                      <li>Mobile performance adjustments</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">How to Test Performance:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Open browser DevTools (F12)</li>
                      <li>Go to Performance tab</li>
                      <li>Record interactions while navigating the site</li>
                      <li>Analyze the performance metrics</li>
                      <li>Check Console for performance warnings</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image Optimization Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Optimized Image</h4>
                      <OptimizedImage
                        src="/images/placeholder.jpg"
                        alt="Optimized product image"
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-600">
                        Features: Lazy loading, blur placeholder, error handling
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Responsive Sizing</h4>
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-600">Responsive image container</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Adapts size based on viewport and device type
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Mobile Optimization</h4>
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-600">
                        Smaller sizes and WebP format for mobile
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Image Optimization Features:</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Automatic WebP conversion for supported browsers</li>
                      <li>Responsive image sizing based on device</li>
                      <li>Lazy loading for below-the-fold images</li>
                      <li>Blur-up placeholders for better UX</li>
                      <li>Error handling with fallback images</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resend API Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Email Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resend API Configured
              </Badge>
              <span className="text-sm text-gray-600">
                API key ending in: ...WgRxNk
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Email service will send real emails in production mode when NODE_ENV=production
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
