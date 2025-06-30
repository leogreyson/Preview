import React from 'react';
import { Box } from '@chakra-ui/react';
import { usePerformanceMode } from '@/hooks/usePerformanceMode';

const KhmerSacredGeometry = React.lazy(() => import('./KhmerSacredGeometry'));

export const BackgroundEffects: React.FC = () => {
  const { shouldReduceEffects } = usePerformanceMode();
  
  if (shouldReduceEffects) {
    return (
      <Box
        position="fixed"
        inset={0}
        zIndex={-10}
        background="linear-gradient(135deg, #f5f3ed 0%, #e8e6df 100%)"
        opacity={0.3}
      />
    );
  }

    return (
      <React.Suspense fallback={null}>
        <KhmerSacredGeometry />
      </React.Suspense>
    );
  };
