/**
 * Mobile optimization utilities and responsive design helpers
 */

// Breakpoint definitions
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Mobile detection utilities
export const mobileDetection = {
  // Check if device is mobile
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  },

  // Check if device is tablet
  isTablet: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) || 
           (window.innerWidth >= 768 && window.innerWidth < 1024);
  },

  // Get device type
  getDeviceType: (): 'mobile' | 'tablet' | 'desktop' => {
    if (mobileDetection.isMobile()) return 'mobile';
    if (mobileDetection.isTablet()) return 'tablet';
    return 'desktop';
  },

  // Check for touch capability
  isTouchDevice: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           (navigator as any).msMaxTouchPoints > 0;
  }
};

// Responsive design utilities
export const responsive = {
  // Generate responsive classes
  getResponsiveClass: (mobile: string, tablet?: string, desktop?: string): string => {
    const classes = [mobile];
    if (tablet) classes.push(`md:${tablet}`);
    if (desktop) classes.push(`lg:${desktop}`);
    return classes.join(' ');
  },

  // Get responsive spacing
  getResponsiveSpacing: (mobile: number, tablet?: number, desktop?: number): string => {
    const spacing = [`${mobile}px`];
    if (tablet) spacing.push(`${tablet}px`);
    if (desktop) spacing.push(`${desktop}px`);
    return spacing.join(' ');
  },

  // Responsive image sizing
  getResponsiveImageSize: (): { width: number; height: number } => {
    if (typeof window === 'undefined') return { width: 400, height: 400 };
    
    const deviceType = mobileDetection.getDeviceType();
    
    switch (deviceType) {
      case 'mobile':
        return { width: 320, height: 320 };
      case 'tablet':
        return { width: 768, height: 768 };
      default:
        return { width: 1200, height: 800 };
    }
  }
};

// Touch gesture utilities
export const touchGestures = {
  // Create swipe detection
  createSwipeDetector: (
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    threshold: number = 50
  ) => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (swipeDistance < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    };

    return {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    };
  },

  // Create long press detector
  createLongPressDetector: (
    onLongPress: () => void,
    duration: number = 500
  ) => {
    let timer: NodeJS.Timeout;

    const handleTouchStart = () => {
      timer = setTimeout(onLongPress, duration);
    };

    const handleTouchEnd = () => {
      clearTimeout(timer);
    };

    return {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    };
  }
};

// Mobile performance optimizations
export const mobilePerformance = {
  // Optimize images for mobile
  optimizeForMobile: (imageUrl: string): string => {
    if (typeof window === 'undefined') return imageUrl;
    
    const isMobileDevice = mobileDetection.isMobile();
    
    if (isMobileDevice) {
      // Add mobile-specific query parameters
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}format=webp&quality=80&width=640`;
    }
    
    return imageUrl;
  },

  // Reduce animations on mobile for better performance
  shouldReduceAnimations: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowEndDevice = mobileDetection.isMobile() && 
                           (navigator.hardwareConcurrency || 4) <= 4;
    
    return prefersReducedMotion || isLowEndDevice;
  },

  // Get appropriate animation duration
  getAnimationDuration: (normalDuration: number): number => {
    return mobilePerformance.shouldReduceAnimations() ? 0 : normalDuration;
  }
};

// Mobile UI utilities
export const mobileUI = {
  // Get safe area insets for notched devices
  getSafeAreaInsets: () => {
    if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };
    
    const computedStyle = getComputedStyle(document.documentElement);
    
    return {
      top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
      right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
      left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')
    };
  },

  // Generate mobile-friendly font sizes
  getResponsiveFontSize: (mobileSize: number, tabletSize?: number, desktopSize?: number): string => {
    const sizes = [`${mobileSize}px`];
    if (tabletSize) sizes.push(`${tabletSize}px`);
    if (desktopSize) sizes.push(`${desktopSize}px`);
    
    return sizes.join(' ');
  },

  // Check if virtual keyboard is visible
  isVirtualKeyboardVisible: (): boolean => {
    if (typeof window === 'undefined') return false;
    const win = window as Window;
    
    // Visual viewport API is more reliable
    if (win.visualViewport) {
      return win.visualViewport.height < win.innerHeight * 0.8;
    }
    
    // Fallback: check if window height significantly changed
    return win.innerHeight < win.screen.height * 0.8;
  }
};

// Mobile testing utilities
export const mobileTesting = {
  // Simulate different screen sizes
  simulateScreenSize: (width: number, height: number) => {
    if (typeof window === 'undefined') return;
    
    // Store original values
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    
    // Override for testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    // Return restore function
    return () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight
      });
      
      window.dispatchEvent(new Event('resize'));
    };
  },

  // Get current viewport information
  getViewportInfo: () => {
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768, deviceType: 'desktop' as const };
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: mobileDetection.getDeviceType(),
      isTouch: mobileDetection.isTouchDevice(),
      pixelRatio: window.devicePixelRatio || 1
    };
  }
};
