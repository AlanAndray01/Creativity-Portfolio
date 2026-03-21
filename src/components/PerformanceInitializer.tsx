'use client';

import { useEffect } from 'react';
import {
  detectPerformanceCapabilitiesSafe,
  PerformanceMetrics,
} from '@/utils/performanceDetector';
import {
  initializeDeviceConfig,
} from '@/utils/deviceConfig';

interface PerformanceInitializerProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    __PERFORMANCE_METRICS__?: PerformanceMetrics;
  }
}

// Initialize config synchronously when file loads in browser
if (typeof window !== 'undefined' && !window.__DEVICE_CONFIG__) {
  let initialMetrics: PerformanceMetrics;
  if (window.__PERFORMANCE_METRICS__) {
    initialMetrics = window.__PERFORMANCE_METRICS__;
  } else {
    initialMetrics = detectPerformanceCapabilitiesSafe();
    window.__PERFORMANCE_METRICS__ = initialMetrics;
  }
  initializeDeviceConfig(initialMetrics);
}

/**
 * Performance Initializer Wrapper
 * Runs performance detection before rendering child components
 * Provides global device config for all children
 */
export default function PerformanceInitializer({
  children,
}: PerformanceInitializerProps) {

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // No delay; just notify GSAP immediately
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <>
      {children}
    </>
  );
}
