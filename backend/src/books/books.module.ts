import { Module } from '@nestjs/common';
import { CategoriesResolver } from './categories.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { NytService } from './nyt.service';
import { BooksResolver } from './books.resolver';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [NytService, CategoriesResolver, BooksResolver],
})
export class BooksModule {}
