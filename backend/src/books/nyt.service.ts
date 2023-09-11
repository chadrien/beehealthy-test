import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { Book, Category } from 'src/graphql';
import { BooksListsNamesResponse, BooksListsResponse } from './nyt.types';

@Injectable()
export class NytService {
  private readonly logger = new Logger(NytService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.httpService.get<T>(url, {
      ...config,
      params: {
        ...config?.params,
        'api-key': this.configService.get<string>('NYT_API_KEY'),
      },
    });
  }

  // See https://developer.nytimes.com/docs/books-product/1/routes/lists/names.json/get
  async getCategories(): Promise<Category[]> {
    return firstValueFrom(
      this.get<BooksListsNamesResponse>(
        'https://api.nytimes.com/svc/books/v3/lists/names.json',
      ).pipe(
        map((response) =>
          response.data.results.map(
            ({ list_name_encoded, display_name }): Category => ({
              id: list_name_encoded,
              name: display_name,
            }),
          ),
        ),
        catchError((error) => {
          this.logger.error(error);
          throw new Error('Unable to fetch categories');
        }),
      ),
    );
  }

  // See https://developer.nytimes.com/docs/books-product/1/routes/lists.json/get
  async getBooks(category: string): Promise<Book[]> {
    return firstValueFrom(
      this.get<BooksListsResponse>(
        'https://api.nytimes.com/svc/books/v3/lists.json',
        {
          params: { list: category },
        },
      ).pipe(
        map((response) =>
          response.data.results
            // NYT API returns books already sorted by rank, but we can't
            // rely on that, so we sort them again just to be sure.
            // E.g. if they change the API to return books in alphabetical order.
            .sort((a, b) => (a.rank > b.rank ? 1 : -1))
            .map(
              ({ book_details, reviews, rank }): Book => ({
                isbn: book_details[0].primary_isbn13,
                rank,
                title: book_details[0].title,
                author: book_details[0].author,
                // It would be nice to get more data through the review API
                // but due to the NYT API's rate limiting, it's not feasible.
                // Rate limit is 5 requests per minute, so if more than 4 books
                // have reviews (1 request is already "used" to query the books list),
                // we will hit the rate limit and would have to wait an entire minute
                // before continuing, which is not acceptable.
                reviews: reviews
                  .filter((review) => review.book_review_link !== '')
                  .map((review) => review.book_review_link),
              }),
            )
            // We only want the top 10 books
            .slice(0, 10),
        ),
        catchError((error) => {
          this.logger.error(error);
          throw new Error('Unable to fetch books');
        }),
      ),
    );
  }
}
