
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IQuery {
    books(category: string): Book[] | Promise<Book[]>;
    categories(): Category[] | Promise<Category[]>;
}

export interface Book {
    isbn: string;
    title: string;
    author: string;
    reviews: string[];
}

export interface Category {
    id: string;
    name: string;
}

type Nullable<T> = T | null;
