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
      .useValue({ request: jest.fn() })
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
      httpService.request.mockReturnValueOnce(of(response));

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
      httpService.request.mockReturnValueOnce(
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
});
