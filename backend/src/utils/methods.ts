import { AnalysisType, ExpenseType, OrderType, ProductTypes } from "./types"

// products worth
export const getWorth = (products: ProductTypes[]) => {
  return products.reduce(
    (total, value) => {
      total.totalCost += value.qty * value.CP
      total.totalWorth += value.qty * value.SP
      return total
    },
    { totalCost: 0, totalWorth: 0 }
  )
}

// store products worth
export const getStoreWorth = (products: ProductTypes[]) => {
  return products.reduce(
    (total, value) => {
      total.totalCost += value.CP * value.store
      total.totalWorth += value.SP * value.store
      return total
    },
    { totalCost: 0, totalWorth: 0 }
  )
}

// calculate profit
export const calculateProfit = (
  orders: OrderType[],
  expenses: ExpenseType[]
) => {
  let grossProfit: number = 0
  let totalReturned: number = 0
  let points: number = 0
  let usedPoints: number = 0

  orders.forEach((order) => {
    points += order.points || 0
    usedPoints += order.usedPoints || 0

    order.orderItems.forEach((item) => {
      grossProfit += item.diff
      if (item.returned > 0) {
        totalReturned += item.price * item.returned
      }
    })
  })

  const allExpenses = expenses.reduce((total: number, value: ExpenseType) => {
    total += value.amount as number
    return total
  }, 0)

  const totals = orders?.reduce(
    (
      total: { totalOrders: number; totalCash: number; totalBank: number },
      order: OrderType
    ) => {
      total.totalOrders += order.total

      if (order.cash !== undefined) total.totalCash += order.cash

      if (order.bank !== undefined) total.totalBank += order.bank

      return total
    },
    { totalOrders: 0, totalCash: 0, totalBank: 0 }
  )

  const analysis: AnalysisType = {
    total: totals.totalOrders,
    totalBank: totals.totalBank,
    totalCash: totals.totalCash,
    usedPoints,
    totalReturned,
    grossProfit,
    expenses: allExpenses,
    points,
    netProfit: grossProfit - allExpenses - points,
  }

  return analysis
}
