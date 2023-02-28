export interface BooksStockInterface {
  objectId: string

  bookId: string

  title: string

  quantity: number

  totalQuantity: number

  quantityBought: number

  totalOrder: number

  lastOrderAt: Date

  quantityUpdateAt: Date

  lastStockCheck: Date

  status: string
}
