import Home from '@/app/page';
import { render, screen } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';
import { GET_CATEGORIES_QUERY } from '@/graphql/queries';
import { getWrapperForMocks } from '../wrapper';

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
