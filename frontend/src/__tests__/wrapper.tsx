/* istanbul ignore file */

import { ChakraProvider } from '@/providers/chakra';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import React, { Suspense } from 'react';

export const getWrapperForMocks: (
  mocks: MockedResponse[],
) => React.FC<React.PropsWithChildren> = (mocks) =>
  function Wrapper({ children }) {
    return (
      <ChakraProvider>
        <MockedProvider mocks={mocks}>
          <Suspense>{children}</Suspense>
        </MockedProvider>
      </ChakraProvider>
    );
  };

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: (error: Error) => React.ReactNode }>
> {
  readonly state = { error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) return this.props.fallbackRender(this.state.error);
    return this.props.children;
  }
}
