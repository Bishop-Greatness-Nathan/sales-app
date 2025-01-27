import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchCustomers,
  createCustomer,
  singleCustomer,
  editCustomer,
  fetchFilteredCustomers,
  resetPointsUsage,
} from "../api/customers"

// get all customers
export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  })
}

// get filtered customers
export const useFilteredCustomers = (customerId: string, debtors: boolean) => {
  return useQuery({
    queryKey: ["filtered", customerId, debtors],
    queryFn: () => fetchFilteredCustomers(customerId, debtors),
  })
}

// create customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  })
}

// single customer
export const useSingleCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => singleCustomer(id),
  })
}

// edit customer
export const useEditCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: editCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      const {
        data: {
          editedCustomer: { _id },
        },
      } = data
      queryClient.invalidateQueries({ queryKey: ["customer", _id] })
    },
  })
}

// reset points usage
export const useResetPointsUsage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resetPointsUsage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  })
}
