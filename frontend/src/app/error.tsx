'use client';

import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';

const Error: React.FC<{ error: Error; reset: () => void }> = ({
  error,
  reset,
}) => {
  return (
    <Center>
      <VStack>
        <Heading>Something went wrong</Heading>
        <Text>{error.message}</Text>
        <Button onClick={reset}>Retry</Button>
      </VStack>
    </Center>
  );
};

export default Error;
