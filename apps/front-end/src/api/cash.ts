import customFetch from "../utils/customFetch"

// FETCH CASH RECORDS
export const fetchCashRecords = async (from: string, to: string) => {
  const {
    data: { cash, balance },
  } = await customFetch.get(`/cash?from=${from}&to=${to}`)
  return { cash, balance }
}

// CREATE CASH RECORD
export const createCashRecord = async (
  data: Record<string, FormDataEntryValue>
) => {
  return await customFetch.post("/cash", data)
}
