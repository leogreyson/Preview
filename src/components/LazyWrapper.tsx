'use client';

import React, { Suspense, lazy } from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = '50px'
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin
  });

  const defaultFallback = (
    <Center h="200px">
      <Spinner size="lg" color="brand.gold" />
    </Center>
  );

  return (
    <Box ref={ref} minH="100px">
      {inView ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </Box>
  );
};

export default LazyWrapper;