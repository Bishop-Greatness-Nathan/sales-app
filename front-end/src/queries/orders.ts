import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createOrder,
  fetchOrders,
  returnItem,
  singleOrder,
  updateOrder,
} from "../api/orders"

// get all orders
export const useOrders = ({
  from,
  to,
  userId,
}: {
  from: string
  to: string
  userId: string
}) => {
  return useQuery({
    queryKey: ["orders", from, to, userId],
    queryFn: () => fetchOrders({ from, to, userId }),
  })
}

// create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["cash"] })
      queryClient.invalidateQueries({ queryKey: ["bank"] })
      queryClient.invalidateQueries({ queryKey: ["stock"] })
    },
  })
}

// get single order
export const useGetSingleOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => singleOrder(id),
  })
}

// update order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["cash-records"] })
      queryClient.invalidateQueries({ queryKey: ["bank-records"] })
    },
  })
}

// return item
export const useReturnItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: returnItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["stock"] })
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
  })
}
