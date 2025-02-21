import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createExpense, fetchExpenses } from "../api/expenses"

// get all expenses
export const useExpenses = (from: string, to: string) => {
  return useQuery({
    queryKey: ["expenses", from, to],
    queryFn: () => fetchExpenses(from, to),
  })
}

// create expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["cash-records"] })
      queryClient.invalidateQueries({ queryKey: ["bank-records"] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
