'use client';

import { useEffect, useState } from 'react';
import './PerformanceLoadingScreen.css';

interface PerformanceLoadingScreenProps {
  isVisible: boolean;
  message?: string;
  progress?: number; // 0-100
}

export default function PerformanceLoadingScreen({
  isVisible,
  message = 'Analyzing device capabilities...',
  progress = 0,
}: PerformanceLoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Keep rendering for a short duration to let the fade out animation play
  const [shouldRender, setShouldRender] = useState(isVisible);

  if (isVisible && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => setShouldRender(false), 500); // Wait for fade out
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Smooth progress animation
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = progress || (prev < 90 ? prev + Math.random() * 20 : prev);
        return Math.min(Math.max(prev, target), 99);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isVisible, progress]);

  if (!shouldRender) return null;

  return (
    <div className={`performance-loading-screen ${!isVisible ? 'fade-out' : ''}`}>
      <div className="performance-loading-content">
        <div className="performance-loading-spinner">
          <div className="spinner-circle"></div>
        </div>

        <h2 className="performance-loading-title">Optimizing Experience</h2>
        <p className="performance-loading-message">{message}</p>

        <div className="performance-progress-bar">
          <div
            className="performance-progress-fill"
            style={{ width: `${displayProgress}%` }}
          ></div>
        </div>

        <p className="performance-progress-text">{Math.round(displayProgress)}%</p>

        <div className="performance-loading-tips">
          <p className="tip">Detecting device capabilities...</p>
          <p className="tip">Setting optimal render quality...</p>
          <p className="tip">Preparing 3D scene...</p>
        </div>
      </div>
    </div>
  );
}
