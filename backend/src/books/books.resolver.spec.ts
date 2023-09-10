import { Test } from '@nestjs/testing';
import { BooksResolver } from './books.resolver';
import { NytService } from './nyt.service';
import { GraphQLError } from 'graphql';

describe('BooksResolver', () => {
  let booksResolver: BooksResolver;
  let nytService: jest.Mocked<NytService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NytService, BooksResolver],
    })
      .overrideProvider(NytService)
      .useValue({ getBooks: jest.fn() })
      .compile();

    booksResolver = module.get(BooksResolver);
    nytService = module.get(NytService);
  });

  it('returns a GraphQLError if fetching the books fails', () => {
    nytService.getBooks.mockRejectedValue(new Error('Unable to fetch books'));
    expect(booksResolver.getBooks('hardcover-fiction')).resolves.toThrow(
      new GraphQLError('Unable to fetch books'),
    );
  });
});
