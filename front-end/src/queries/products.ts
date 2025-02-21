import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchProducts,
  createProduct,
  updateProduct,
  singleProduct,
} from "../api/products"

// get all products query
export const useProductQuery = (product: string, category: string) => {
  return useQuery({
    queryKey: ["products", product, category],
    queryFn: () => fetchProducts(product, category),
  })
}
// export const useProductQuery = () => {
//   return useQuery({
//     queryKey: ["products"],
//     queryFn: fetchProducts,
//   })
// }

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
