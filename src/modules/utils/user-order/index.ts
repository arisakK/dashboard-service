import omit from 'lodash/omit'
import dayjs from 'dayjs'
import { isEqual, orderBy } from 'lodash'

export class UserOrderUtil {
  static getTotalUserOrder(EGenres: object, userOrders: any[]) {
    const genres = Object.assign(
      {},
      ...Object.values(EGenres).map((genre) => ({
        [genre]: { quantity: 0, total: 0, books: [] },
      })),
    )

    for (const userOrder of userOrders) {
      genres[userOrder.genre] = omit(userOrder, ['genre'])
    }

    return genres
  }

  static getWeekDay(values: any[]) {
    const weeks = []

    for (let day = 6; day > 0; day--) {
      weeks.push({
        totalPrice: 0,
        count: 0,
        date: dayjs().subtract(day, 'days').format('DD/MM/YYYY'),
      })
    }

    for (const value of values) {
      const index = weeks.findIndex((day) => isEqual(day.date, value.date))
      if (index !== -1) {
        weeks[index] = value
      }
    }

    // pie chart
    // console.log(Object.keys(weeks).map((label) => label))
    // console.log(Object.values(weeks).map((value) => value['count']))
    // const labels = []
    // const data = []
    // Object.entries(weeks).map(([key, value]) => {
    //   labels.push(key)
    //   data.push(value['count'])
    // })

    return orderBy(weeks, ['date'])
  }

  static includingVat(totalPrice: number): number {
    return (totalPrice * 7) / 100 + totalPrice
  }
}
