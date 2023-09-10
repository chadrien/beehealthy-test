import { Args, Query, Resolver } from '@nestjs/graphql';
import { NytService } from './nyt.service';

@Resolver('Book')
export class BooksResolver {
  constructor(private readonly nytService: NytService) {}

  @Query('books')
  async getBooks(@Args('category') category: string) {
    return await this.nytService.getBooks(category);
  }
}
