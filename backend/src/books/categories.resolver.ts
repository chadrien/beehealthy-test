import { Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { NytService } from './nyt.service';

@Resolver('Category')
export class CategoriesResolver {
  constructor(private readonly nytService: NytService) {}

  @Query('categories')
  async getCategories() {
    try {
      return await this.nytService.getCategories();
    } catch {
      return new GraphQLError('Unable to fetch categories');
    }
  }
}
