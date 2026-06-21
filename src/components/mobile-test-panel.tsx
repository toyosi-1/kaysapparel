"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  mobileDetection, 
  mobileUI, 
  mobileTesting, 
  mobilePerformance,
  responsive 
} from '@/lib/mobile-optimization';
import { usePerformanceMonitor } from '@/lib/performance';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Touch, 
  Zap, 
  Gauge,
  Eye
} from 'lucide-react';

export function MobileTestPanel() {
  const [viewportInfo, setViewportInfo] = useState(mobileTesting.getViewportInfo());
  const [performanceReport, setPerformanceReport] = useState<any>({});
  const { getReport, logReport } = usePerformanceMonitor();

  useEffect(() => {
    const handleResize = () => {
      setViewportInfo(mobileTesting.getViewportInfo());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updatePerformanceReport = () => {
    const report = getReport();
    setPerformanceReport(report);
  };

  const getDeviceIcon = () => {
    switch (viewportInfo.deviceType) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getDeviceColor = () => {
    switch (viewportInfo.deviceType) {
      case 'mobile':
        return 'bg-blue-100 text-blue-800';
      case 'tablet':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Responsiveness Test Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Device Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            {getDeviceIcon()}
            <h3 className="font-semibold mt-2">Device Type</h3>
            <Badge className={getDeviceColor()}>
              {viewportInfo.deviceType}
            </Badge>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Gauge className="h-5 w-5 mx-auto" />
            <h3 className="font-semibold mt-2">Viewport</h3>
            <p className="text-sm text-gray-600">
              {viewportInfo.width} × {viewportInfo.height}
            </p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Touch className="h-5 w-5 mx-auto" />
            <h3 className="font-semibold mt-2">Touch Device</h3>
            <Badge variant={viewportInfo.isTouch ? "default" : "secondary"}>
              {viewportInfo.isTouch ? "Yes" : "No"}
            </Badge>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Eye className="h-5 w-5 mx-auto" />
            <h3 className="font-semibold mt-2">Pixel Ratio</h3>
            <p className="text-sm text-gray-600">
              {viewportInfo.pixelRatio}x
            </p>
          </div>
        </div>

        {/* Mobile Features */}
        <div className="space-y-4">
          <h3 className="font-semibold">Mobile Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Touch Gestures</h4>
              <div className="space-y-1 text-sm">
                <p>• Swipe detection enabled</p>
                <p>• Long press detection enabled</p>
                <p>• Touch-optimized interactions</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Performance</h4>
              <div className="space-y-1 text-sm">
                <p>• Reduced animations: {mobilePerformance.shouldReduceAnimations() ? 'Yes' : 'No'}</p>
                <p>• Mobile image optimization: Active</p>
                <p>• Lazy loading: Enabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Safe Area Testing */}
        <div className="space-y-4">
          <h3 className="font-semibold">Safe Area Testing (Notched Devices)</h3>
          <div className="p-4 border rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Top:</span>
                <span className="ml-2">{mobileUI.getSafeAreaInsets().top}px</span>
              </div>
              <div>
                <span className="font-medium">Right:</span>
                <span className="ml-2">{mobileUI.getSafeAreaInsets().right}px</span>
              </div>
              <div>
                <span className="font-medium">Bottom:</span>
                <span className="ml-2">{mobileUI.getSafeAreaInsets().bottom}px</span>
              </div>
              <div>
                <span className="font-medium">Left:</span>
                <span className="ml-2">{mobileUI.getSafeAreaInsets().left}px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Typography Test */}
        <div className="space-y-4">
          <h3 className="font-semibold">Responsive Typography Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <h4 className="text-lg font-bold">Mobile Heading</h4>
              <p className="text-sm">Small text for mobile</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <h4 className="text-xl font-bold">Tablet Heading</h4>
              <p className="text-base">Medium text for tablet</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <h4 className="text-2xl font-bold">Desktop Heading</h4>
              <p className="text-lg">Large text for desktop</p>
            </div>
          </div>
        </div>

        {/* Performance Testing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Performance Testing</h3>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={updatePerformanceReport}>
                <Gauge className="h-4 w-4 mr-2" />
                Update Report
              </Button>
              <Button size="sm" variant="outline" onClick={logReport}>
                <Zap className="h-4 w-4 mr-2" />
                Log Report
              </Button>
            </div>
          </div>
          
          {Object.keys(performanceReport).length > 0 && (
            <div className="p-4 border rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(performanceReport, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test Instructions */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Testing Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Resize your browser window to test different breakpoints</li>
            <li>Use browser dev tools to simulate mobile devices</li>
            <li>Test touch interactions on mobile devices</li>
            <li>Check performance metrics on different devices</li>
            <li>Verify safe area handling on notched devices</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
