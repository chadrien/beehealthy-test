import { Book } from '@/@types/codegen/graphql';
import { ErrorBoundary, getWrapperForMocks } from '@/__tests__/wrapper';
import BooksPage from '@/app/[category]/page';
import { GET_CATEGORIES_AND_BOOKS_QUERY } from '@/graphql/queries';
import { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

describe('BooksPage', () => {
  it('renders a list of books', async () => {
    const books: Book[] = [
      { isbn: '1', title: 'Book 1', author: 'Author 1', reviews: [] },
      {
        isbn: '2',
        title: 'Book 2',
        author: 'Author 2',
        reviews: ['http://link.to/book-2-review'],
      },
      {
        isbn: '3',
        title: 'Book 3',
        author: 'Author 3',
        reviews: ['http://link.to/book-3-review'],
      },
    ];

    const mock: MockedResponse = {
      request: {
        query: GET_CATEGORIES_AND_BOOKS_QUERY,
        variables: { booksCategory: '1' },
      },
      result: {
        data: {
          categories: [{ id: '1', name: 'Fiction' }],
          books,
        },
      },
    };

    render(<BooksPage params={{ category: '1' }} />, {
      wrapper: getWrapperForMocks([mock]),
    });

    await Promise.all(
      books.map(async ({ isbn, title, author, reviews }) => {
        expect(await screen.findByText(isbn)).toBeInTheDocument();
        expect(await screen.findByText(title)).toBeInTheDocument();
        expect(await screen.findByText(author)).toBeInTheDocument();
        await Promise.all(
          reviews.map(async (review) => {
            expect(await screen.findByText(review)).toBeInTheDocument();
          }),
        );
      }),
    );
  });

  it('404', async () => {
    const mock: MockedResponse = {
      request: {
        query: GET_CATEGORIES_AND_BOOKS_QUERY,
        variables: { booksCategory: 'not-found' },
      },
      result: {
        data: {
          categories: [{ id: '1', name: 'Fiction' }],
          books: [],
        },
      },
    };

    // It's currently to prevent errors from being logged to the console
    // even when using an ErrorBoundary, so we need to mock it to prevent
    // console pollution when running the test.
    // See https://github.com/facebook/react/issues/15069
    const consoleError = jest.spyOn(console, 'error');
    consoleError.mockImplementation(() => null);

    const fallbackRender = jest.fn(() => null);

    render(
      <ErrorBoundary fallbackRender={fallbackRender}>
        <BooksPage params={{ category: 'not-found' }} />
      </ErrorBoundary>,
      {
        wrapper: getWrapperForMocks([mock]),
      },
    );

    await waitFor(() => {
      expect(fallbackRender).toHaveBeenCalled();
    });
    // Calling `notFound()` throws an error with the message 'NEXT_NOT_FOUND'.
    // See https://nextjs.org/docs/app/api-reference/functions/not-found#notfound
    expect(fallbackRender).toHaveBeenCalledWith(new Error('NEXT_NOT_FOUND'));

    consoleError.mockRestore();
  });
});
