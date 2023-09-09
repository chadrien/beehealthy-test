'use client';

import { Center, Spinner, VisuallyHidden } from '@chakra-ui/react';

const Loading: React.FC = () => {
  return (
    <Center w="100vw" h="100vh">
      <VisuallyHidden>Loading...</VisuallyHidden>
      <Spinner size="xl" />
    </Center>
  );
};

export default Loading;
