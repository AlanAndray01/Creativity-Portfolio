/**
 * Performance Detection System
 * Runs BEFORE Three.js scene initialization to detect device capabilities
 * and determine appropriate graphics quality level
 */

export type DeviceTier = 'LOW' | 'MEDIUM' | 'HIGH';

export interface PerformanceMetrics {
  cpuCores: number;
  ramGB: number;
  pixelRatio: number;
  gpuInfo: string;
  gpuTier: 'low' | 'medium' | 'high';
  cpuScore: number;
  memoryScore: number;
  gpuScore: number;
  combinedScore: number;
  detectedTier: DeviceTier;
  isMobile: boolean;
  timestamp: number;
}

declare global {
  interface Navigator {
    hardwareConcurrency?: number;
    deviceMemory?: number;
  }
}

/**
 * Detect GPU capabilities using WebGL context
 * Returns GPU renderer info and estimated tier
 */
function detectGPU(): { info: string; tier: 'low' | 'medium' | 'high' } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    
    if (!gl) {
      return { info: 'WebGL not supported', tier: 'low' };
    }

    // Try to get GPU info via extension
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    let gpuString = 'Unknown GPU';
    
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      gpuString = renderer || 'Unknown GPU';
    }

    // Estimate GPU tier based on renderer string
    const gpuLower = gpuString.toLowerCase();
    let tier: 'low' | 'medium' | 'high' = 'medium';

    // Low-tier indicators
    if (
      gpuLower.includes('mali') ||
      gpuLower.includes('adreno 300') ||
      gpuLower.includes('adreno 400') ||
      gpuLower.includes('intel hd 4000') ||
      gpuLower.includes('intel hd 5000') ||
      gpuLower.includes('radeon') && !gpuLower.includes('radeon rx') ||
      gpuLower.includes('geforce gt 640') ||
      gpuLower.includes('geforce gt 730')
    ) {
      tier = 'low';
    }
    // High-tier indicators
    else if (
      gpuLower.includes('rtx 4090') ||
      gpuLower.includes('rtx 4080') ||
      gpuLower.includes('rtx 4070') ||
      gpuLower.includes('rtx 3090') ||
      gpuLower.includes('rtx 3080') ||
      gpuLower.includes('rtx 3070') ||
      gpuLower.includes('geforce rtx') ||
      gpuLower.includes('radeon rx 7000') ||
      gpuLower.includes('radeon rx 6800') ||
      gpuLower.includes('radeon rx 6700') ||
      gpuLower.includes('apple gpu') ||
      gpuLower.includes('m1') ||
      gpuLower.includes('m2') ||
      gpuLower.includes('m3')
    ) {
      tier = 'high';
    }
    // Medium-tier (default)
    else if (
      gpuLower.includes('intel iris') ||
      gpuLower.includes('adreno 5') ||
      gpuLower.includes('adreno 6') ||
      gpuLower.includes('mali-g7') ||
      gpuLower.includes('mali-g8') ||
      gpuLower.includes('geforce gtx 1050') ||
      gpuLower.includes('geforce gtx 960')
    ) {
      tier = 'medium';
    }

    return { info: gpuString, tier };
  } catch (error) {
    console.warn('GPU detection failed:', error);
    return { info: 'Detection failed', tier: 'medium' };
  }
}

/**
 * Calculate CPU score based on cores
 * More cores = higher score (but with diminishing returns)
 */
function calculateCPUScore(cores: number): number {
  // Normalize to 0-100 scale
  // 1 core = 20, 4 cores = 50, 8 cores = 75, 16 cores = 100
  if (cores <= 1) return 20;
  if (cores <= 2) return 35;
  if (cores <= 4) return 50;
  if (cores <= 8) return 75;
  return Math.min(100, 75 + (cores - 8) * 3);
}

/**
 * Calculate memory score based on available RAM
 * More RAM = higher score
 */
function calculateMemoryScore(ramGB: number): number {
  // Normalize to 0-100 scale
  // <1GB = 10, 2GB = 30, 4GB = 60, 8GB = 90, 16GB+ = 100
  if (ramGB < 1) return 10;
  if (ramGB < 2) return 20;
  if (ramGB < 4) return 40;
  if (ramGB < 8) return 70;
  if (ramGB < 16) return 90;
  return 100;
}

/**
 * Calculate GPU score based on detected tier
 */
function calculateGPUScore(tier: 'low' | 'medium' | 'high'): number {
  const scores = {
    low: 30,
    medium: 65,
    high: 100,
  };
  return scores[tier];
}

/**
 * Determine device tier based on combined scores
 */
function determineTier(cpuScore: number, memoryScore: number, gpuScore: number): DeviceTier {
  const combinedScore = (cpuScore * 0.2 + memoryScore * 0.2 + gpuScore * 0.6) / 100;

  if (combinedScore < 0.4) {
    return 'LOW';
  } else if (combinedScore < 0.7) {
    return 'MEDIUM';
  } else {
    return 'HIGH';
  }
}

/**
 * Main performance detection function
 * Run this BEFORE initializing Three.js scene
 */
export function detectPerformanceCapabilities(): PerformanceMetrics {
  const startTime = performance.now();

  // Detect CPU cores
  const cpuCores = navigator.hardwareConcurrency || 4;

  // Detect RAM (may be undefined on some browsers)
  const ramGB = navigator.deviceMemory || 4;

  // Get pixel ratio
  const pixelRatio = window.devicePixelRatio || 1;

  // Detect GPU
  const { info: gpuInfo, tier: gpuTier } = detectGPU();

  // Calculate scores
  const cpuScore = calculateCPUScore(cpuCores);
  const memoryScore = calculateMemoryScore(ramGB);
  const gpuScore = calculateGPUScore(gpuTier);

  // Determine overall tier
  const combinedScore = (cpuScore * 0.2 + memoryScore * 0.2 + gpuScore * 0.6) / 100;
  const detectedTier = determineTier(cpuScore, memoryScore, gpuScore);

  // Check if mobile/tablet
  const isMobile = window.innerWidth < 768;

  // Log performance metrics
  if (process.env.NODE_ENV === 'development') {
    console.log('=== Performance Detection ===');
    console.log(`CPU Cores: ${cpuCores} (Score: ${cpuScore.toFixed(1)})`);
    console.log(`RAM: ${ramGB}GB (Score: ${memoryScore.toFixed(1)})`);
    console.log(`GPU: ${gpuInfo} (Tier: ${gpuTier}, Score: ${gpuScore.toFixed(1)})`);
    console.log(`Pixel Ratio: ${pixelRatio}x`);
    console.log(`Combined Score: ${combinedScore.toFixed(2)}`);
    console.log(`Detected Tier: ${detectedTier}`);
    console.log(`Mobile: ${isMobile}`);
    console.log(`Detection Time: ${(performance.now() - startTime).toFixed(2)}ms`);
    console.log('==============================');
  }

  return {
    cpuCores,
    ramGB,
    pixelRatio,
    gpuInfo,
    gpuTier,
    cpuScore,
    memoryScore,
    gpuScore,
    combinedScore,
    detectedTier,
    isMobile,
    timestamp: Date.now(),
  };
}

/**
 * Safe wrapper with error handling and fallback
 */
export function detectPerformanceCapabilitiesSafe(): PerformanceMetrics {
  try {
    return detectPerformanceCapabilities();
  } catch (error) {
    console.error('Performance detection error, using MEDIUM fallback:', error);
    
    return {
      cpuCores: 4,
      ramGB: 4,
      pixelRatio: window.devicePixelRatio || 1,
      gpuInfo: 'Detection failed - using fallback',
      gpuTier: 'medium',
      cpuScore: 50,
      memoryScore: 60,
      gpuScore: 65,
      combinedScore: 0.6,
      detectedTier: 'MEDIUM',
      isMobile: window.innerWidth < 768,
      timestamp: Date.now(),
    };
  }
}
