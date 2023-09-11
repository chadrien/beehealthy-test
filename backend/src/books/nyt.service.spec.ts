import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NytService } from './nyt.service';
import { Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { BooksListsNamesResponse, BooksListsResponse } from './nyt.types';
import { DeepPartial } from 'src/types/utils';

describe('NytService', () => {
  let nytService: NytService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [NytService],
    })
      .overrideProvider(HttpService)
      .useValue({ get: jest.fn() })
      .overrideProvider(ConfigService)
      .useValue({ get: jest.fn() })
      .compile();

    module.useLogger(false);

    nytService = module.get(NytService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
  });

  describe('get', () => {
    it('reads the NYT API key from the config', async () => {
      configService.get.mockReturnValueOnce('my-api-key');

      await nytService['get'](
        'https://api.nytimes.com/svc/books/v3/lists/names.json',
        {
          params: {
            foo: 'bar',
          },
        },
      );

      expect(configService.get).toHaveBeenCalledWith('NYT_API_KEY');
      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            'api-key': 'my-api-key',
          }),
        }),
      );
    });
  });

  describe('getCategories', () => {
    it('returns categories', async () => {
      const response: AxiosResponse<DeepPartial<BooksListsNamesResponse>> = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
        data: {
          status: 'OK',
          copyright:
            'Copyright (c) 2019 The New York Times Company.  All Rights Reserved.',
          num_results: 53,
          results: [
            {
              list_name: 'Combined Print and E-Book Fiction',
              display_name: 'Combined Print & E-Book Fiction',
              list_name_encoded: 'combined-print-and-e-book-fiction',
              oldest_published_date: '2011-02-13',
              newest_published_date: '2016-03-20',
              updated: 'WEEKLY',
            },
          ],
        },
      };
      httpService.get.mockReturnValueOnce(of(response));

      expect(await nytService.getCategories()).toEqual([
        {
          id: 'combined-print-and-e-book-fiction',
          name: 'Combined Print & E-Book Fiction',
        },
      ]);
    });

    it('throws an error if the request fails', async () => {
      httpService.get.mockReturnValueOnce(
        throwError(() => ({
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: undefined,
          data: {},
        })),
      );

      await expect(nytService.getCategories()).rejects.toThrow(
        'Unable to fetch categories',
      );
    });
  });

  describe('getBooks', () => {
    it('returns books', async () => {
      const response: AxiosResponse<DeepPartial<BooksListsResponse>> = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
        data: {
          status: 'OK',
          copyright:
            'Copyright (c) 2019 The New York Times Company.  All Rights Reserved.',
          num_results: 1,
          last_modified: '2016-03-11T13:09:01-05:00',
          results: [
            {
              list_name: 'Hardcover Fiction',
              display_name: 'Hardcover Fiction',
              bestsellers_date: '2016-03-05',
              published_date: '2016-03-20',
              rank: 5,
              rank_last_week: 2,
              weeks_on_list: 2,
              asterisk: 0,
              dagger: 0,
              amazon_product_url:
                'http://www.amazon.com/Girls-Guide-Moving-On-Novel-ebook/dp/B00ZNE17B4?tag=thenewyorktim-20',
              isbns: [{ isbn10: '553391925', isbn13: '9780553391923' }],
              book_details: [
                {
                  title: "A GIRL'S GUIDE TO MOVING ON",
                  description:
                    'A mother and her daughter-in-law both leave unhappy marriages and take up with new men.',
                  contributor: 'by Debbie Macomber',
                  author: 'Debbie Macomber',
                  contributor_note: '',
                  price: 0,
                  age_group: '',
                  publisher: 'Ballantine',
                  primary_isbn13: '9780553391923',
                  primary_isbn10: '553391925',
                },
              ],
              reviews: [
                {
                  book_review_link: '',
                  first_chapter_link: '',
                  sunday_review_link: '',
                  article_chapter_link: '',
                },
              ],
            },
          ],
        },
      };
      httpService.get.mockReturnValueOnce(of(response));

      expect(await nytService.getBooks('hardcover-fiction')).toEqual([
        {
          isbn: '9780553391923',
          title: "A GIRL'S GUIDE TO MOVING ON",
          author: 'Debbie Macomber',
          reviews: [],
        },
      ]);
    });

    it('includes reviews if present', async () => {
      const response: AxiosResponse<DeepPartial<BooksListsResponse>> = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
        data: {
          status: 'OK',
          results: [
            {
              book_details: [{}],
              reviews: [
                {
                  book_review_link:
                    'https://www.nytimes.com/2018/10/18/books/review/how-to-rewire-your-traumatized-brain.html',
                  first_chapter_link: '',
                  sunday_review_link: '',
                  article_chapter_link: '',
                },
              ],
            },
          ],
        },
      };
      httpService.get.mockReturnValueOnce(of(response));

      expect(await nytService.getBooks('hardcover-fiction')).toEqual([
        expect.objectContaining({
          reviews: [
            'https://www.nytimes.com/2018/10/18/books/review/how-to-rewire-your-traumatized-brain.html',
          ],
        }),
      ]);
    });

    it('returns empty reviews if there are no reviews', async () => {
      const response: AxiosResponse<DeepPartial<BooksListsResponse>> = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
        data: {
          status: 'OK',
          results: [
            {
              book_details: [{}],
              reviews: [
                {
                  book_review_link: '',
                  first_chapter_link: '',
                  sunday_review_link: '',
                  article_chapter_link: '',
                },
              ],
            },
          ],
        },
      };
      httpService.get.mockReturnValueOnce(of(response));

      expect(await nytService.getBooks('hardcover-fiction')).toEqual([
        expect.objectContaining({
          reviews: [],
        }),
      ]);
    });

    it('sorts the books by rank', async () => {
      const response: AxiosResponse<DeepPartial<BooksListsResponse>> = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
        data: {
          status: 'OK',
          results: [
            {
              rank: 2,
              book_details: [{ primary_isbn13: '2' }],
              reviews: [],
            },
            {
              rank: 1,
              book_details: [
                {
                  primary_isbn13: '1',
                },
              ],
              reviews: [],
            },
            {
              rank: 3,
              book_details: [
                {
                  primary_isbn13: '3',
                },
              ],
              reviews: [],
            },
          ],
        },
      };
      httpService.get.mockReturnValueOnce(of(response));

      const books = await nytService.getBooks('hardcover-fiction');
      expect(books[0].isbn).toEqual('1');
      expect(books[1].isbn).toEqual('2');
      expect(books[2].isbn).toEqual('3');
    });

    it('throws an error if the request fails', async () => {
      httpService.get.mockReturnValueOnce(
        throwError(() => ({
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: undefined,
          data: {},
        })),
      );

      await expect(nytService.getBooks('hardcover-fiction')).rejects.toThrow(
        'Unable to fetch books',
      );
    });
  });
});
