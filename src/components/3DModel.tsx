'use client';

import { useEffect, useRef } from 'react';
import { wrap, transfer } from 'comlink';
import styles from './3DModel.module.css';
import { getDeviceConfig } from '@/utils/deviceConfig';
import { getQualityPreset } from '@/utils/qualityPresets';

export default function Model3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Dynamically create the canvas to avoid React StrictMode transferControlToOffscreen issues
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'auto';
    container.appendChild(canvas);

    let offscreen: OffscreenCanvas;
    try {
      offscreen = canvas.transferControlToOffscreen();
    } catch (e) {
      console.warn('OffscreenCanvas transfer failed:', e);
      return;
    }
    
    workerRef.current = new Worker(new URL('../workers/three.worker.ts', import.meta.url));
    const workerApi = wrap<import('../workers/three.worker').ThreeWorkerApi>(workerRef.current);

    let preset = null;
    try {
        const config = getDeviceConfig();
        preset = getQualityPreset(config.tier);
    } catch (error) {
        console.warn('[3DModel] Device config not available, using defaults:', error);
    }

    workerApi.init(transfer(offscreen, [offscreen]), container.clientWidth, container.clientHeight, window.devicePixelRatio || 1, preset);

    const onMouseMove = (e: MouseEvent) => {
        const mouseMultiplier = preset?.mouseMultiplier ?? 5;
        const mouseX = (e.clientX - window.innerWidth / 2) * mouseMultiplier;
        const mouseY = (e.clientY - window.innerHeight / 2) * mouseMultiplier;
        workerApi.onMouseMove(mouseX, mouseY);
    };

    const onResize = () => {
        if (!container) return;
        workerApi.onResize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        workerApi.cleanup();
        workerRef.current?.terminate();
        if (container) {
          container.innerHTML = '';
        }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      id="3dmodal"
      className={styles.modal3D} 
      aria-label="Interactive 3D floating animation"
      role="img"
    />
  );
}
