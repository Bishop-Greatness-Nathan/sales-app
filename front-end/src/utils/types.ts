export type UserTypes = {
  firstName: string
  lastName: string
  branch?: string
  userName?: string
  role?: string
  _id?: string
  approved?: boolean
}

export type ProductTypes = {
  _id: string
  CP: number
  SP: number
  branch?: string
  image?: string
  name: string
  qty: number
  store: number
  userId?: string
  minimumQty?: number
  maximumQty?: number
  category?: string
}

export type WorthType = {
  totalCost: number
  totalWorth: number
}

export type SingleProductType = {
  _id: string
  name: string
  CP: number
  SP: number
  qty: number
  store?: number
}

export type OrderItemsType = {
  name: string
  cost: number
  price: number
  pcs: number
  subTotal: number
  returned: number
  diff: number
  productId?: string
  _id?: string
  orderId?: string
  newQty?: number
  newDiff?: number
  returnType?: string
}

export type OrderType = {
  _id: string
  userId: string
  total: number
  enteredAt: string
  orderItems: OrderItemsType[]
  balance?: number
  cash?: number
  bank?: number
  customer: CustomerType
  points?: number
  createdAt?: string
}

export type CustomerType = {
  _id: string
  firstName: string
  lastName: string
  phoneNumber: string
  debt?: number
  role: string
  points?: number
  pointsUsage?: number
}

export type ExpenseType = {
  _id: string
  description: string
  amount: number
  userId: string
  enteredAt?: string
  enteredBy?: string
  createdAt?: string
}

export type AnalysisType = {
  total: number
  totalReturned: number
  grossProfit: number
  expenses: number
  netProfit: number
  totalCash: number
  totalBank: number
  points?: number
}

export type TransactionType = {
  _id: string
  amount: number
  enteredBy: string
  remark: string
  enteredAt: string
  action?: string
  createdAt?: string
}

export type CategoryType = {
  _id: string
  name: string
}

export type CreateOrderType = {
  items: OrderItemsType[]
  total: number
  cash: number
  bank: number
  balance: number
  customer: CustomerType
}
