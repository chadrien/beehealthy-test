'use client';

import PageLayout from '@/components/PageLayout';
import { GET_CATEGORIES_QUERY } from '@/graphql/queries';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { Link } from '@chakra-ui/next-js';
import { ListItem, SimpleGrid, Text, UnorderedList } from '@chakra-ui/react';

const Home: React.FC = () => {
  const { data } = useSuspenseQuery(GET_CATEGORIES_QUERY, {
    // fetchPolicy: 'network-only',
  });

  const midIndex = Math.floor(data.categories.length / 2);
  const col1Categories = data.categories.slice(0, midIndex);
  const col2Categories = data.categories.slice(midIndex);

  return (
    <PageLayout title="New York Times bestsellers categories">
      <SimpleGrid columns={2} spacing={10}>
        {[col1Categories, col2Categories].map((categories, index) => (
          <UnorderedList key={index}>
            {categories.map((category, index) => (
              <ListItem key={index}>
                <Text>
                  {/* Because of API rate limits, we can't prefetch or we will go over the limit way too fast */}
                  <Link href={`/${category.id}`} prefetch={false}>
                    {category.name}
                  </Link>
                </Text>
              </ListItem>
            ))}
          </UnorderedList>
        ))}
      </SimpleGrid>
    </PageLayout>
  );
};

export default Home;
