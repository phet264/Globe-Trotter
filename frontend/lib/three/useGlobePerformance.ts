import { useState, useEffect } from 'react';

export type PerformanceMode = 'high' | 'medium' | 'low' | 'no-webgl';

export function useGlobePerformance() {
  const [mode, setMode] = useState<PerformanceMode>('high');
  const [dpr, setDpr] = useState<number>(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Detect capabilities and adjust DPR
    const devicePixelRatio = window.devicePixelRatio || 1;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // We cap DPR to 2 to avoid extreme performance issues on 3x/4x screens
    let calculatedDpr = Math.min(2, devicePixelRatio);
    let initialMode: PerformanceMode = 'high';

    if (isMobile) {
      calculatedDpr = Math.min(1.5, devicePixelRatio);
      initialMode = 'medium';
    }

     
    setDpr(calculatedDpr);
     
    setMode(initialMode);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return { mode, dpr, reducedMotion, setMode };
}
