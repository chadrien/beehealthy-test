'use client';

import { GET_CATEGORIES_QUERY } from '@/graphql/queries';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Heading,
} from '@chakra-ui/react';

const Home: React.FC = () => {
  const { data } = useSuspenseQuery(GET_CATEGORIES_QUERY, {
    fetchPolicy: 'network-only',
  });

  return (
    <Container paddingY={5}>
      <Heading marginBottom={10}>New York Times bestseller books</Heading>
      <Accordion allowToggle>
        {data.categories.map((category, index) => (
          <AccordionItem key={index}>
            <Heading size="lg">
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {category.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel paddingBottom={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
};

export default Home;
