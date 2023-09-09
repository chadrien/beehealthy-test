import '@testing-library/jest-dom';
import Home from '@/app/page';
import { render, screen } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import { Suspense } from 'react';
import { GET_CATEGORIES_QUERY } from '@/graphql/queries';

describe('Home', () => {
  it('renders a list of categories', async () => {
    const categories = [
      { id: '1', name: 'Fiction' },
      { id: '2', name: 'Nonfiction' },
      { id: '3', name: 'Young Adult' },
    ];

    const mock: MockedResponse = {
      request: {
        query: GET_CATEGORIES_QUERY,
      },
      result: {
        data: {
          categories,
        },
      },
    };

    render(<Home />, { wrapper: getWrapperForMocks([mock]) });

    await Promise.all(
      categories.map(async (category) => {
        expect(await screen.findByText(category.name)).toBeInTheDocument();
      }),
    );
  });
});

const getWrapperForMocks: (
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
