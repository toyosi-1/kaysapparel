"use client";

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

interface LazySectionProps {
  loader?: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export function LazySection({ 
  loader, 
  fallback = <DefaultFallback />, 
  children 
}: LazySectionProps) {
  if (children) {
    return <Suspense fallback={fallback}>{children}</Suspense>;
  }

  if (loader) {
    const LazyComponent = lazy(loader);
    return (
      <Suspense fallback={fallback}>
        <LazyComponent />
      </Suspense>
    );
  }

  return <div>Invalid LazySection configuration</div>;
}

function DefaultFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

// Predefined lazy components for common use cases
export function LazyAdminDashboard() {
  return (
    <LazySection
      loader={() => import('@/app/admin/page')}
      fallback={<DefaultFallback />}
    />
  );
}

export function LazyAccountPage() {
  return (
    <LazySection
      loader={() => import('@/app/account/page')}
      fallback={<DefaultFallback />}
    />
  );
}

export function LazyCheckout() {
  return (
    <LazySection
      loader={() => import('@/app/checkout/page')}
      fallback={<DefaultFallback />}
    />
  );
}
