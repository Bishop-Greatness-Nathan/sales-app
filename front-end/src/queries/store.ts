import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createStoreProduct,
  fetchStoreProducts,
  updateStoreProduct,
} from "../api/store"

// get all store products query
export const storeProductQuery = (product: string, category: string) => {
  return useQuery({
    queryKey: ["store", product, category],
    queryFn: () => fetchStoreProducts(product, category),
  })
}

// create store product query
export const useCreateStoreProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStoreProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["store"] }),
  })
}

// update store product query
export const useUpdateStoreProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["stock"] })
    },
  })
}
