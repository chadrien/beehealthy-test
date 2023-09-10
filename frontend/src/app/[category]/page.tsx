'use client';

import PageLayout from '@/components/PageLayout';
import { GET_CATEGORIES_AND_BOOKS_QUERY } from '@/graphql/queries';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { ArrowBackIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  List,
  ListItem,
  SimpleGrid,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { notFound } from 'next/navigation';
import BookCardBodySection from './BookCardBodySection';

const BooksPage: React.FC<{ params: { category: string } }> = ({ params }) => {
  const { data } = useSuspenseQuery(GET_CATEGORIES_AND_BOOKS_QUERY, {
    variables: { booksCategory: params.category },
    // fetchPolicy: 'network-only',
  });

  const categoryDisplayName = data.categories.find(
    ({ id }) => id === params.category,
  )?.name;

  if (!categoryDisplayName) {
    notFound();
  }

  return (
    <PageLayout title={`NYT Bestsellers for category: ${categoryDisplayName}`}>
      <VStack spacing={5} align="normal">
        <Link href="/">
          <Heading as="p" size="md">
            <ArrowBackIcon /> Back to categories list
          </Heading>
        </Link>
        <SimpleGrid columns={2} spacing={10}>
          {data.books.map((book, index) => (
            <Card key={index}>
              <CardHeader>
                <Heading as="p" size="sm">
                  {book.title}
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack divider={<StackDivider />} spacing={4} align="normal">
                  <BookCardBodySection title="Book info">
                    <List>
                      {[
                        { label: 'Author', value: book.author },
                        { label: 'ISBN', value: book.isbn },
                      ].map(({ label, value }, index) => (
                        <ListItem key={index}>
                          <Text fontSize="sm">
                            <Text fontWeight={700} as="span">
                              {label}:
                            </Text>{' '}
                            {value}
                          </Text>
                        </ListItem>
                      ))}
                    </List>
                  </BookCardBodySection>
                  {book.reviews.length > 0 && (
                    <BookCardBodySection title="Reviews">
                      <List>
                        {book.reviews.map((review, index) => (
                          <ListItem key={index}>
                            <Text fontSize="sm">
                              <Link href={review}>
                                {review} <ExternalLinkIcon mx="2px" />
                              </Link>
                            </Text>
                          </ListItem>
                        ))}
                      </List>
                    </BookCardBodySection>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </PageLayout>
  );
};

export default BooksPage;
