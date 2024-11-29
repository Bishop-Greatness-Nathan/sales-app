import customFetch from "../utils/customFetch"

// FETCH BANK RECORDS
export const fetchBankRecords = async (from: string, to: string) => {
  const {
    data: { bank, balance },
  } = await customFetch.get(`/bank?from=${from}&to=${to}`)
  return { bank, balance }
}

// CREATE BANK RECORD
export const createBankRecord = async (
  data: Record<string, FormDataEntryValue>
) => {
  return await customFetch.post("/bank", data)
}
