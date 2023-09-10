import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

describe('Books (e2e)', () => {
  let app: INestApplication;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue({ get: jest.fn() })
      .compile();

    httpService = module.get(HttpService);

    app = module.createNestApplication({
      logger: false,
    });
    await app.init();
  });

  describe('categories', () => {
    it('returns a list of categories', () => {
      const response: AxiosResponse = {
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

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: '{ categories { id name } }' })
        .expect(200)
        .expect((response) =>
          expect(response.body.data.categories).toEqual([
            {
              id: 'combined-print-and-e-book-fiction',
              name: 'Combined Print & E-Book Fiction',
            },
          ]),
        );
    });

    it('handle errors', () => {
      httpService.get.mockReturnValueOnce(
        throwError(() => ({
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: undefined,
          data: {},
        })),
      );

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: '{ categories { id name } }' })
        .expect(200)
        .expect((response) =>
          expect(response.body.errors).toContainEqual(
            expect.objectContaining({
              message: 'Unable to fetch categories',
            }),
          ),
        );
    });
  });

  describe('books', () => {
    it('returns a list of books', () => {
      const response: AxiosResponse = {
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
              isbns: [{ isbn10: 553391925, isbn13: '9780553391923' }],
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
                  primary_isbn10: 553391925,
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

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: '{ books(category: "hardcover-fiction") { isbn title } }',
        })
        .expect(200)
        .expect((response) =>
          expect(response.body.data.books).toEqual([
            {
              isbn: '9780553391923',
              title: "A GIRL'S GUIDE TO MOVING ON",
            },
          ]),
        );
    });

    it('handle errors', () => {
      httpService.get.mockReturnValueOnce(
        throwError(() => ({
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: undefined,
          data: {},
        })),
      );

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: '{ books(category: "hardcover-fiction") { isbn title } }',
        })
        .expect(200)
        .expect((response) =>
          expect(response.body.errors).toContainEqual(
            expect.objectContaining({
              message: 'Unable to fetch books',
            }),
          ),
        );
    });
  });
});
