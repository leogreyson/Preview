'use client';

import type { ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({});

export default function ChakraProviders({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  );
}
