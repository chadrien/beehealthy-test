import { Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { GraphQLError } from 'graphql';

@Resolver('Category')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query('categories')
  async getCategories() {
    try {
      return await this.categoriesService.findAll();
    } catch {
      return new GraphQLError('Unable to fetch categories');
    }
  }
}
