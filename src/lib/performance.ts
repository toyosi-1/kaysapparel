/**
 * Performance monitoring and optimization utilities
 */

// Performance metrics tracking
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component render time
  trackRenderTime(componentName: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    
    this.metrics.get(componentName)!.push(renderTime);
    
    // Keep only last 10 measurements
    const measurements = this.metrics.get(componentName)!;
    if (measurements.length > 10) {
      measurements.shift();
    }
    
    // Log slow renders
    if (renderTime > 100) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Get average render time for a component
  getAverageRenderTime(componentName: string): number {
    const measurements = this.metrics.get(componentName) || [];
    if (measurements.length === 0) return 0;
    
    const sum = measurements.reduce((acc, val) => acc + val, 0);
    return sum / measurements.length;
  }

  // Get performance report
  getPerformanceReport(): Record<string, { avg: number; samples: number }> {
    const report: Record<string, { avg: number; samples: number }> = {};
    
    this.metrics.forEach((measurements, component) => {
      report[component] = {
        avg: this.getAverageRenderTime(component),
        samples: measurements.length
      };
    });
    
    return report;
  }
}

// Hook for tracking component performance
export function usePerformanceTracking(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();
  
  const trackRender = (startTime: number) => {
    monitor.trackRenderTime(componentName, startTime);
  };
  
  return { trackRender };
}

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image sizes
  generateSrcSet(basePath: string, widths: number[]): string => {
    return widths
      .map(width => `${basePath}?w=${width} ${width}w`)
      .join(', ');
  },

  // Get optimal image size based on container
  getOptimalSize(containerWidth: number, maxWidth: number = 1200): number {
    const sizes = [320, 640, 768, 1024, 1200];
    return sizes.find(size => size >= containerWidth) || maxWidth;
  },

  // Lazy load intersection observer
  createIntersectionObserver(callback: (entries: IntersectionObserverEntry[]) => void): IntersectionObserver {
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
  }
};

// Bundle size optimization
export const bundleOptimization = {
  // Dynamic import helper
  lazyLoad: <T>(importFunction: () => Promise<T>) => {
    return importFunction();
  },

  // Code splitting for heavy components
  loadComponent: async (componentPath: string) => {
    try {
      const module = await import(componentPath);
      return module.default;
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error);
      return null;
    }
  }
};

// Memory management
export const memoryManagement = {
  // Cleanup function for components
  cleanup: (cleanupFunctions: (() => void)[]) => {
    return () => {
      cleanupFunctions.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      });
    };
  },

  // Debounce utility for performance
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
};

// Performance monitoring hook
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  
  const logPerformanceReport = () => {
    const report = monitor.getPerformanceReport();
    console.table(report);
  };
  
  return {
    getReport: monitor.getPerformanceReport.bind(monitor),
    logReport: logPerformanceReport
  };
}
