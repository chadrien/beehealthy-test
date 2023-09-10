import { Container, Heading } from '@chakra-ui/react';

const PageLayout: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => {
  return (
    <Container paddingY={5} maxW="3xl">
      <Heading marginBottom={10}>{title}</Heading>
      {children}
    </Container>
  );
};

export default PageLayout;
