import { CategoriesService } from './categories.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [CategoriesService],
    })
      .overrideProvider(HttpService)
      .useValue({ request: jest.fn() })
      .overrideProvider(ConfigService)
      .useValue({ get: jest.fn() })
      .compile();
    module.useLogger(false);

    categoriesService = module.get(CategoriesService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
  });

  describe('findAll', () => {
    it('should return categories', async () => {
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

      expect(await categoriesService.findAll()).toEqual([
        {
          id: 'combined-print-and-e-book-fiction',
          name: 'Combined Print & E-Book Fiction',
        },
      ]);
    });

    it('reads the NYT API key from the config', async () => {
      httpService.request.mockReturnValueOnce(
        of({
          status: 200,
          statusText: 'OK',
          headers: {},
          config: undefined,
          data: { results: [] },
        }),
      );
      configService.get.mockReturnValueOnce('my-api-key');

      await categoriesService.findAll();

      expect(configService.get).toHaveBeenCalledWith('NYT_API_KEY');
      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            'api-key': 'my-api-key',
          },
        }),
      );
    });

    it('throws an error if the request fails', async () => {
      httpService.request.mockReturnValueOnce(
        throwError(() => ({
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: undefined,
          data: {},
        })),
      );

      await expect(categoriesService.findAll()).rejects.toThrow(
        'Unable to fetch categories',
      );
    });
  });
});
