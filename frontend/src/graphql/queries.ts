import { graphql } from '@/@types/codegen';

export const GET_CATEGORIES_QUERY = graphql(/* GraphQL */ `
  query GetCategories {
    categories {
      id
      name
    }
  }
`);

export const GET_CATEGORIES_AND_BOOKS_QUERY = graphql(/* GraphQL */ `
  query GetCategoriesAndBooks($booksCategory: String!) {
    categories {
      id
      name
    }

    books(category: $booksCategory) {
      isbn
      rank
      title
      author
      reviews
    }
  }
`);
