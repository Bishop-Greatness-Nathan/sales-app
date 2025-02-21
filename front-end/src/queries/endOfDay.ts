import { useQuery } from "@tanstack/react-query"
import { getStock } from "../api/endOfDay"

export const useGetStock = (
  date: string,
  product: string,
  category: string
) => {
  return useQuery({
    queryKey: ["stock", date, product, category],
    queryFn: () => getStock(date, product, category),
  })
}
