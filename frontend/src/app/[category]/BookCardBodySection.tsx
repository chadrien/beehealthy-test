import { Box, Heading } from '@chakra-ui/react';

const BookCardBodySection: React.FC<
  React.PropsWithChildren<{ title: string }>
> = ({ children, title }) => {
  return (
    <Box>
      <Heading as="p" size="xs" marginBottom={2}>
        {title}
      </Heading>
      {children}
    </Box>
  );
};

export default BookCardBodySection;
