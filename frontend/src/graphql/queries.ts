import { graphql } from '@/@types/codegen';

export const GET_CATEGORIES_QUERY = graphql(/* GraphQL */ `
  query GetCategories {
    categories {
      id
      name
    }
  }
`);
