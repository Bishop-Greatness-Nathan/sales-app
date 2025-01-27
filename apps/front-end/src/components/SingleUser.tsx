import { useState, useEffect } from "react"
import { UserTypes } from "../utils/types"
import axios from "axios"
import { toast } from "react-toastify"
import { useApproveUser } from "../queries/users"

function SingleUser({
  firstName,
  lastName,
  role,
  approved,
  _id,
  userName,
}: UserTypes) {
  const [approve, setApprove] = useState(approved)

  const { mutate, isError, error } = useApproveUser()

  //   HANDLE CHANGE
  const handleChange = async (_id: string) => {
    setApprove(!approve)
    mutate(_id)
  }

  // responses
  useEffect(() => {
    if (isError) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
      }
    }
  }, [isError])
  return (
    <>
      {role !== "admin" && (
        <div className='grid grid-cols-5 border bg-white'>
          <p className='col-span-2 text-[8px] md:text-sm lg:text-base p-2 capitalize relative'>
            {firstName + " " + lastName}
          </p>
          <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
            {userName}
          </p>
          <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
            {role}
          </p>

          <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
            <input
              type='checkbox'
              name='permission'
              id='permission'
              checked={approve}
              onChange={() => handleChange(_id as string)}
            />
          </p>
        </div>
      )}
    </>
  )
}

export default SingleUser
