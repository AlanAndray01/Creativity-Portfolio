/**
 * Global Device Configuration Store
 * Stores performance metrics and quality tier globally
 * Accessible from all components via window.__DEVICE_CONFIG__
 */

import { DeviceTier, PerformanceMetrics } from './performanceDetector';
import { QualityPreset, getQualityPreset } from './qualityPresets';

export interface DeviceConfigStore {
  metrics: PerformanceMetrics;
  tier: DeviceTier;
  preset: QualityPreset;
  isReady: boolean;
  userOverride: DeviceTier | null;
  detectionTime: number;
}

declare global {
  interface Window {
    __DEVICE_CONFIG__?: DeviceConfigStore;
  }
}

/**
 * Initialize global device config
 * Call this as early as possible in app initialization
 */
export function initializeDeviceConfig(metrics: PerformanceMetrics): DeviceConfigStore {
  let userOverride: DeviceTier | null = null;
  
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('__QUALITY_OVERRIDE__');
    if (saved === 'LOW' || saved === 'MEDIUM' || saved === 'HIGH') {
      userOverride = saved as DeviceTier;
    }
  }

  const activeTier = userOverride || metrics.detectedTier;

  const config: DeviceConfigStore = {
    metrics,
    tier: activeTier,
    preset: getQualityPreset(activeTier),
    isReady: true,
    userOverride,
    detectionTime: metrics.timestamp,
  };

  // Store globally
  if (typeof window !== 'undefined') {
    window.__DEVICE_CONFIG__ = config;
  }

  return config;
}

/**
 * Get global device config
 */
export function getDeviceConfig(): DeviceConfigStore {
  if (typeof window !== 'undefined' && window.__DEVICE_CONFIG__) {
    return window.__DEVICE_CONFIG__;
  }

  // Fallback (should not happen if detection runs first)
  throw new Error('Device config not initialized. Run detection first.');
}

/**
 * Override quality tier manually
 * Useful for UX toggle: Low / Medium / High
 */
export function overrideQualityTier(tier: DeviceTier): DeviceConfigStore {
  if (typeof window !== 'undefined') {
    localStorage.setItem('__QUALITY_OVERRIDE__', tier);
    
    if (window.__DEVICE_CONFIG__) {
      const config = window.__DEVICE_CONFIG__;
      config.userOverride = tier;
      config.tier = tier;
      config.preset = getQualityPreset(tier);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Quality tier manually overridden to: ${tier}`);
      }

      return config;
    }
  }

  throw new Error('Device config not initialized');
}

/**
 * Reset to auto-detected tier (remove manual override)
 */
export function resetToAutoDetectedTier(): DeviceConfigStore {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('__QUALITY_OVERRIDE__');
    
    if (window.__DEVICE_CONFIG__) {
      const config = window.__DEVICE_CONFIG__;
      config.userOverride = null;
      config.tier = config.metrics.detectedTier;
      config.preset = getQualityPreset(config.metrics.detectedTier);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Reset to auto-detected tier: ${config.tier}`);
      }

      return config;
    }
  }

  throw new Error('Device config not initialized');
}

/**
 * Get current active tier (considering overrides)
 */
export function getActiveTier(): DeviceTier {
  const config = getDeviceConfig();
  return config.tier;
}

/**
 * Get current active preset
 */
export function getActivePreset(): QualityPreset {
  const config = getDeviceConfig();
  return config.preset;
}

/**
 * Check if we're on LOW tier
 */
export function isLowTier(): boolean {
  return getActiveTier() === 'LOW';
}

/**
 * Check if we're on MEDIUM tier
 */
export function isMediumTier(): boolean {
  return getActiveTier() === 'MEDIUM';
}

/**
 * Check if we're on HIGH tier
 */
export function isHighTier(): boolean {
  return getActiveTier() === 'HIGH';
}

/**
 * Get debug info string
 */
export function getDebugInfo(): string {
  const config = getDeviceConfig();
  return `
Device Tier: ${config.tier}
Auto-detected: ${config.metrics.detectedTier}
User Override: ${config.userOverride || 'None'}
CPU: ${config.metrics.cpuCores} cores
RAM: ${config.metrics.ramGB}GB
GPU: ${config.metrics.gpuInfo} (${config.metrics.gpuTier})
Pixel Ratio: ${config.metrics.pixelRatio}x
Mobile: ${config.metrics.isMobile}
  `.trim();
}
