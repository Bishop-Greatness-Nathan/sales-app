import { Types } from "mongoose"

export type ProductTypes = {
  _id: Types.ObjectId
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

export type OrderItemsType = {
  name: string
  cost: number
  price: number
  pcs: number
  subTotal: number
  returned: number
  diff: number
  productId?: string
  _id?: Types.ObjectId
  orderId?: Types.ObjectId
  newQty?: number
  newDiff?: number
  returnType?: string
}

export type CustomerType = {
  _id: Types.ObjectId
  firstName: string
  lastName: string
  phoneNumber: string
  debt?: number
  role: string
}

export type OrderType = {
  _id: Types.ObjectId
  userId: string
  total: number
  enteredAt: string
  orderItems: OrderItemsType[]
  balance?: number
  cash?: number
  bank?: number
  customer: CustomerType
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
}

export type ExpenseType = {
  _id: Types.ObjectId
  description: string
  amount: number
  userId: string
  enteredAt?: string
  enteredBy?: string
  createdAt?: string
}
