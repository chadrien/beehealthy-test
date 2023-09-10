import { Args, Query, Resolver } from '@nestjs/graphql';
import { NytService } from './nyt.service';
import { GraphQLError } from 'graphql';

@Resolver('Book')
export class BooksResolver {
  constructor(private readonly nytService: NytService) {}

  @Query('books')
  async getBooks(@Args('category') category: string) {
    try {
      return await this.nytService.getBooks(category);
    } catch {
      return new GraphQLError('Unable to fetch books');
    }
  }
}
