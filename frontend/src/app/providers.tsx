import { ApolloProvider } from '../providers/apollo';
import { ChakraProvider } from '../providers/chakra';
import React from 'react';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ChakraProvider>
      <ApolloProvider>{children}</ApolloProvider>
    </ChakraProvider>
  );
};
