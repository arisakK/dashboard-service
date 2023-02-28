import { ESortBooksQuery } from '../../books/dto/books-query.dto'
import EGenreQuery from './enum/genre-query.enum'

export class BooksUtil {
  static getQueryByCategory(key: string, query?: Record<string, any>) {
    if (key === EGenreQuery.ALL) {
      return { ...query }
    }
    if (key === EGenreQuery.LITERARY_FICTION) {
      return { ...query, genre: EGenreQuery.LITERARY_FICTION }
    }
    if (key === EGenreQuery.BILDUNGSROMAN) {
      return { ...query, genre: EGenreQuery.BILDUNGSROMAN }
    }
    if (key === EGenreQuery.HORROR) {
      return { ...query, genre: EGenreQuery.HORROR }
    }
    if (key === EGenreQuery.MYSTERY) {
      return { ...query, genre: EGenreQuery.MYSTERY }
    }
    if (key === EGenreQuery.HISTORICAL) {
      return { ...query, genre: EGenreQuery.HISTORICAL }
    }
    if (key === EGenreQuery.ROMANCE) {
      return { ...query, genre: EGenreQuery.ROMANCE }
    }
    if (key === EGenreQuery.WESTERN) {
      return { ...query, genre: EGenreQuery.WESTERN }
    }
    if (key === EGenreQuery.THRILLER) {
      return { ...query, genre: EGenreQuery.THRILLER }
    }
    if (key === EGenreQuery.SPECULATIVE_FICTION) {
      return { ...query, genre: EGenreQuery.SPECULATIVE_FICTION }
    }
  }

  static sort(key: string) {
    if (key === ESortBooksQuery.PRICE_DESC) {
      return { price: 'desc' }
    }
    if (key === ESortBooksQuery.PRICE_ASC) {
      return { price: 'asc' }
    }
    if (key === ESortBooksQuery.QUANTITY_ASC) {
      return { quantity: 'asc' }
    }
    if (key === ESortBooksQuery.QUANTITY_DESC) {
      return { quantity: 'desc' }
    }
  }
}
