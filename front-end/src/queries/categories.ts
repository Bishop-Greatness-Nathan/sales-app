import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createCategory,
  deleteCategory,
  editCategory,
  fetchCategories,
} from "../api/categories"

// get all categories query
export const useCategoryQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  })
}

// create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  })
}

// edit category
export const useEditCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: editCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  })
}
// delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  })
}
