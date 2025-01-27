import customFetch from "../utils/customFetch"

// FETCH USERS
export const fetchUsers = async () => {
  const {
    data: { users },
  } = await customFetch.get("/user")
  return users
}

// APPROVE USERS
export const approveUser = async (id: string) => {
  return await customFetch.patch(`/user/approve-user/${id}`)
}
