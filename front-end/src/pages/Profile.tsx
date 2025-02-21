import { useState, ChangeEvent } from "react"
import FormRow from "../components/FormRow"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import { useDashboardContext } from "./DashboardLayout"
import { UserTypes } from "../utils/types"
import axios from "axios"

const Profile = () => {
  const { currentUser } = useDashboardContext()
  const [inputs, setInputs] = useState<UserTypes>({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    branch: currentUser.branch,
    userName: currentUser.userName,
  })

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await customFetch.patch(`/user/update-user/${currentUser._id}`, inputs)
      toast.success("profile updated")
      location.reload()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return error
      }
    }
  }

  return (
    <div className='p-4'>
      <div className='bg-white p-5 py-10 md:p-10 rounded-md'>
        <h1 className='text-2xl md-2xl mb-5'>Profile</h1>
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-center'
        >
          <FormRow
            type='text'
            name='firstName'
            labelText='first name'
            value={inputs.firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputs({ ...inputs, firstName: e.target.value })
            }
            extraStyle='capitalize'
            required
          />
          <FormRow
            type='text'
            name='lastName'
            labelText='last name'
            value={inputs.lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputs({ ...inputs, lastName: e.target.value })
            }
            extraStyle='capitalize'
            required
          />
          {currentUser.role === "admin" && (
            <FormRow
              type='text'
              name='branch'
              labelText='branch'
              value={inputs.branch}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputs({ ...inputs, branch: e.target.value })
              }
              extraStyle='capitalize'
              required
            />
          )}
          <FormRow
            type='text'
            name='userName'
            labelText='username'
            value={inputs.userName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputs({ ...inputs, userName: e.target.value })
            }
            extraStyle='capitalize'
            required
          />

          <button
            type='submit'
            className={`text-white self-end bg-[var(--primary)] rounded cursor-pointer hover:bg-[var(--hoverColor)] ease-in-out duration-300 mt-7 p-[10px] `}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
