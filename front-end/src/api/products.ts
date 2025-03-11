import customFetch from "../utils/customFetch"
import { ProductTypes, WorthType } from "../utils/types"

// FETCH PRODUCTS
export const fetchProducts = async (
  product: string,
  category: string,
  limit: number,
  page: number
): Promise<{
  products: ProductTypes[]
  worth: WorthType
  count: number
  numOfPages: number
}> => {
  const {
    data: { products, worth, count, numOfPages },
  } = await customFetch.get(
    `/product?product=${product}&category=${category}&limit=${limit}&page=${page}`
  )

  return { products, worth, count, numOfPages }
}

// CREATE PRODUCT
export const createProduct = async (
  data: Record<string, FormDataEntryValue>
) => {
  return await customFetch.post("/product", data)
}

// EDIT PRODUCT
export const updateProduct = async ({
  id,
  data,
}: {
  id: string | undefined
  data: Record<string, FormDataEntryValue>
}) => {
  return await customFetch.patch(`/product/${id}`, data)
}

// GET SINGLE PRODUCT
export const singleProduct = async (id: string) => {
  const {
    data: { product },
  } = await customFetch.get(`/product/${id}`)
  return product
}
