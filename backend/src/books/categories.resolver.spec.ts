import { Test } from '@nestjs/testing';
import { CategoriesResolver } from './categories.resolver';
import { NytService } from './nyt.service';
import { GraphQLError } from 'graphql';

describe('CategoriesResolver', () => {
  let booksResolver: CategoriesResolver;
  let nytService: jest.Mocked<NytService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NytService, CategoriesResolver],
    })
      .overrideProvider(NytService)
      .useValue({ getCategories: jest.fn() })
      .compile();

    booksResolver = module.get(CategoriesResolver);
    nytService = module.get(NytService);
  });

  it('returns a GraphQLError if fetching the categories fails', () => {
    nytService.getCategories.mockRejectedValue(
      new Error('Unable to fetch categories'),
    );
    expect(booksResolver.getCategories()).resolves.toThrow(
      new GraphQLError('Unable to fetch categories'),
    );
  });
});
