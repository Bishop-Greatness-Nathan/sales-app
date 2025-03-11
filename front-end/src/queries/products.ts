import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchProducts,
  createProduct,
  updateProduct,
  singleProduct,
} from "../api/products"

// get all products
export const useProductQuery = (
  product: string,
  category: string,
  limit: number,
  page: number
) => {
  return useQuery({
    queryKey: ["products", product, category, limit, page],
    queryFn: () => fetchProducts(product, category, limit, page),
  })
}

// get single product
export const useGetSingleProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => singleProduct(id),
  })
}

// create product
export const useAddProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["stock"] })
    },
  })
}

// edit product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["stock"] })
      const {
        data: {
          updatedProduct: { _id },
        },
      } = data
      queryClient.invalidateQueries({ queryKey: ["product", _id] })
    },
  })
}
