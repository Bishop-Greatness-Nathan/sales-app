import customFetch from "../utils/customFetch"

// FETCH STORE PRODUCTS
export const fetchStoreProducts = async (product: string, category: string) => {
  const {
    data: { products, storeWorth },
  } = await customFetch.get(`/store?product=${product}&category=${category}`)
  return { products, storeWorth }
}

// CREATE STORE PRODUCT
export const createStoreProduct = async (
  data: Record<string, FormDataEntryValue>
) => {
  return await customFetch.post("/store", data)
}

// UPDATE STORE PRODUCT
export const updateStoreProduct = async ({
  id,
  data,
}: {
  id: string | undefined
  data: Record<string, FormDataEntryValue>
}) => {
  return await customFetch.patch(`/store/${id}`, data)
}
