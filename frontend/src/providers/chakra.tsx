'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';

const { Container, Heading, Spinner, Accordion, Button } =
  chakraTheme.components;

const theme = extendBaseTheme({
  components: { Container, Heading, Spinner, Accordion, Button },
});

export const ChakraProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <CacheProvider>
      <ChakraBaseProvider theme={theme}>{children}</ChakraBaseProvider>
    </CacheProvider>
  );
};
