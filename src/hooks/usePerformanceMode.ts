// Create: src/hooks/usePerformanceMode.ts
import { useState, useEffect } from 'react';
import { useBreakpointValue } from '@chakra-ui/react';

export const usePerformanceMode = () => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  useEffect(() => {
    // Check for user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  return {
    isMobile: !!isMobile,
    reduceMotion,
    shouldReduceEffects: isMobile || reduceMotion
  };
};