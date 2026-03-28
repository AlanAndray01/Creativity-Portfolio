import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Festivity - Portfolio",
  description: "3D Dynamic Collisions Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Font Awesome icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css"
        />
        {/* Performance Detection - Runs BEFORE app initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // Run performance detection synchronously
                (function() {
                  try {
                    // Import performance detection inline
                    function detectGPU() {
                      try {
                        const canvas = document.createElement('canvas');
                        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                        
                        if (!gl) {
                          return { info: 'WebGL not supported', tier: 'low' };
                        }

                        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                        let gpuString = 'Unknown GPU';
                        
                        if (debugInfo) {
                          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                          gpuString = renderer || 'Unknown GPU';
                        }

                        const gpuLower = gpuString.toLowerCase();
                        let tier = 'medium';

                        if (
                          gpuLower.includes('mali') ||
                          gpuLower.includes('adreno 300') ||
                          gpuLower.includes('adreno 400') ||
                          gpuLower.includes('intel hd 4000') ||
                          gpuLower.includes('intel hd 5000') ||
                          (gpuLower.includes('radeon') && !gpuLower.includes('radeon rx')) ||
                          gpuLower.includes('geforce gt 640') ||
                          gpuLower.includes('geforce gt 730')
                        ) {
                          tier = 'low';
                        } else if (
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
                        } else if (
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
                        return { info: 'Detection failed', tier: 'medium' };
                      }
                    }

                    function calculateCPUScore(cores) {
                      if (cores <= 1) return 20;
                      if (cores <= 2) return 35;
                      if (cores <= 4) return 50;
                      if (cores <= 8) return 75;
                      return Math.min(100, 75 + (cores - 8) * 3);
                    }

                    function calculateMemoryScore(ramGB) {
                      if (ramGB < 1) return 10;
                      if (ramGB < 2) return 20;
                      if (ramGB < 4) return 40;
                      if (ramGB < 8) return 70;
                      if (ramGB < 16) return 90;
                      return 100;
                    }

                    function calculateGPUScore(tier) {
                      return { low: 30, medium: 65, high: 100 }[tier];
                    }

                    function determineTier(cpuScore, memoryScore, gpuScore) {
                      const combinedScore = (cpuScore * 0.2 + memoryScore * 0.2 + gpuScore * 0.6) / 100;
                      if (combinedScore < 0.4) return 'LOW';
                      if (combinedScore < 0.7) return 'MEDIUM';
                      return 'HIGH';
                    }

                    const cpuCores = navigator.hardwareConcurrency || 4;
                    const ramGB = navigator.deviceMemory || 4;
                    const pixelRatio = window.devicePixelRatio || 1;
                    const { info: gpuInfo, tier: gpuTier } = detectGPU();

                    const cpuScore = calculateCPUScore(cpuCores);
                    const memoryScore = calculateMemoryScore(ramGB);
                    const gpuScore = calculateGPUScore(gpuTier);

                    const detectedTier = determineTier(cpuScore, memoryScore, gpuScore);
                    const isMobile = window.innerWidth < 768;

                    const metrics = {
                      cpuCores,
                      ramGB,
                      pixelRatio,
                      gpuInfo,
                      gpuTier,
                      cpuScore,
                      memoryScore,
                      gpuScore,
                      combinedScore: (cpuScore * 0.2 + memoryScore * 0.2 + gpuScore * 0.6) / 100,
                      detectedTier,
                      isMobile,
                      timestamp: Date.now(),
                    };

                    // Store in sessionStorage for later access
                    window.__PERFORMANCE_METRICS__ = metrics;
                    sessionStorage.setItem('__PERFORMANCE_METRICS__', JSON.stringify(metrics));

                    console.log('[Performance Detection] Tier detected:', detectedTier);
                  } catch (error) {
                    console.error('[Performance Detection] Error:', error);
                  }
                })();
              }
            `,
          }}
        />

        {/* Auto-scroll to top on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  setTimeout(() => window.scrollTo(0, 0), 100);
                });
                history.scrollRestoration = 'manual';
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
