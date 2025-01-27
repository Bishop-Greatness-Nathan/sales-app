import customFetch from "../utils/customFetch"

// FETCH EXPENSES
export const fetchExpenses = async (from: string, to: string) => {
  const {
    data: { expenses },
  } = await customFetch.get(`/expense?from=${from}&to=${to}`)
  return expenses
}

// CREATE EXPENSE
export const createExpense = async (
  data: Record<string, FormDataEntryValue>
) => {
  return await customFetch.post("/expense", data)
}
