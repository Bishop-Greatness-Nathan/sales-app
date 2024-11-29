import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchCashRecords, createCashRecord } from "../api/cash"

// get all cash records
export const useCashRecords = (from: string, to: string) => {
  return useQuery({
    queryKey: ["cash-records", from, to],
    queryFn: () => fetchCashRecords(from, to),
  })
}

// create cash record
export const useCreateCashRecord = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCashRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-records"] })
      queryClient.invalidateQueries({ queryKey: ["bank-records"] })
    },
  })
}
