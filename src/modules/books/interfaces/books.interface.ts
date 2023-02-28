import EGenre from '../../books-stock/enum/genre.enum'

export interface BooksInterface {
  objectId: string

  title: string

  descr: string

  author: string

  genre: EGenre

  publisher: string

  price: number

  imageUrl: string

  status: string
}
