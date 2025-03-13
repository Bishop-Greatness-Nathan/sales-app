import customFetch from "../utils/customFetch"
import { CreateOrderType, OrderItemsType } from "../utils/types"

// FETCH ORDERS
export const fetchOrders = async ({
  from,
  to,
  userId,
  page,
  limit,
}: {
  from: string
  to: string
  userId: string
  page: number
  limit: number
}) => {
  const {
    data: { orders, analysis, count, numOfPages },
  } = await customFetch.get(
    `/order?from=${from}&to=${to}&userId=${userId}&page=${page}&limit=${limit}`
  )
  return { orders, analysis, count, numOfPages }
}

// CREATE ORDER
export const createOrder = async (data: CreateOrderType) => {
  return await customFetch.post("/order", data)
}

// GET SINGLE ORDER
export const singleOrder = async (id: string) => {
  const {
    data: { order },
  } = await customFetch.get(`/order/${id}`)
  return order
}

// UPDATE ORDER
export const updateOrder = async ({
  id,
  balance,
  amountPaid,
  paymentType,
}: {
  id: string | undefined
  balance: number
  amountPaid: number
  paymentType: string
}) => {
  return await customFetch.patch(`/order/${id}`, {
    balance,
    amountPaid,
    paymentType,
  })
}

// RETURN ITEM
export const returnItem = async ({
  orderId,
  itemId,
  data,
}: {
  orderId: string
  itemId: string
  data: OrderItemsType
}) => {
  return await customFetch.patch(
    `/order/return-item?orderId=${orderId}&&itemId=${itemId}`,
    data
  )
}
