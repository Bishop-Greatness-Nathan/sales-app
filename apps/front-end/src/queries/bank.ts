import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchBankRecords, createBankRecord } from "../api/bank"

// get all bank records
export const useBankRecords = (from: string, to: string) => {
  return useQuery({
    queryKey: ["bank-records", from, to],
    queryFn: () => fetchBankRecords(from, to),
  })
}

// create bank record
export const useCreateBankRecord = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBankRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-records"] })
      queryClient.invalidateQueries({ queryKey: ["cash-records"] })
    },
  })
}
