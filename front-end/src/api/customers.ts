import customFetch from "../utils/customFetch"

// FETCH CUSTOMERS
export const fetchCustomers = async () => {
  const {
    data: { customers },
  } = await customFetch.get("/customer")
  return customers
}

// FETCH FILTERED CUSTOMERS
export const fetchFilteredCustomers = async (
  customerId: string,
  debtors: boolean,
  page: number,
  limit: number
) => {
  const {
    data: { customers, count, numOfPages },
  } = await customFetch.get(
    `/customer/filter?customerId=${customerId}&debtors=${debtors}&page=${page}&limit=${limit}`
  )
  return { customers, count, numOfPages }
}

// CREATE CUSTOMER
export const createCustomer = async (
  data: Record<string, FormDataEntryValue>
) => {
  return await customFetch.post("/customer", data)
}

// SINGLE CUSTOMER
export const singleCustomer = async (id: string) => {
  const {
    data: { customer },
  } = await customFetch.get(`/customer/${id}`)
  return customer
}

// EDIT CUSTOMER
export const editCustomer = async ({
  id,
  data,
}: {
  id: string | undefined
  data: Record<string, FormDataEntryValue>
}) => {
  return await customFetch.patch(`/customer/${id}`, data)
}

// RESET POINTS USAGE
export const resetPointsUsage = async () => {
  return await customFetch.get("/customer/reset")
}
