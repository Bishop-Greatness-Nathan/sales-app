import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { approveUser, fetchUsers } from "../api/users"

// get all users query
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })
}

// approve user
export const useApproveUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: approveUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}
