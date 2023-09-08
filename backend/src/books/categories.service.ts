import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll() {
    return firstValueFrom(
      this.httpService
        .request({
          // See https://developer.nytimes.com/docs/books-product/1/routes/lists/names.json/get
          url: 'https://api.nytimes.com/svc/books/v3/lists/names.json',
          method: 'GET',
          params: {
            'api-key': this.configService.get<string>('NYT_API_KEY'),
          },
        })
        .pipe(
          map((response) =>
            response.data.results.map(
              ({ list_name_encoded, display_name }) => ({
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
}
