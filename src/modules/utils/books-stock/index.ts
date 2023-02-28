import omit from 'lodash/omit'
import isEqual from 'lodash/fp/isEqual'

export class BooksStockUtils {
  static getTopSellerGenre(EGenres: object, userOrders: any[]) {
    const genres = Object.values(EGenres).map((genre) => ({
      genre: genre,
      topSeller: [],
    }))

    for (const userOrder of userOrders) {
      const index = genres.findIndex((genre) =>
        isEqual(genre.genre, userOrder.genre),
      )
      if (index !== -1) {
        genres[index].topSeller = userOrder.topSeller
      }
    }

    return genres
  }
}
