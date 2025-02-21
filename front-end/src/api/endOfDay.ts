import customFetch from "../utils/customFetch"

export const getStock = async (
  date: string,
  product: string,
  category: string
) => {
  const {
    data: { products, worth },
  } = await customFetch.get(
    `/endofday?date=${date}&product=${product}&category=${category}`
  )
  return { products, worth }
}
