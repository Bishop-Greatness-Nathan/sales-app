import { useState, ChangeEvent } from "react"
import PasswordInput from "./PasswordInput"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import axios from "axios"
import { useDashboardContext } from "../pages/DashboardLayout"

function ChangePassword() {
  const { logout } = useDashboardContext()
  const [submitting, setSubmitting] = useState(false)

  const submitForm = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    try {
      await customFetch.post("/user/change-password", data)
      toast.success("password changed successfully")
      logout()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
    setSubmitting(false)
  }

  return (
    <main className='rounded p-2 md:p-5 shadow-md shadow-slate-300 bg-white'>
      <h1 className='font-semibold text-center text-base md:text-xl'>
        Change Password
      </h1>
      <form onSubmit={submitForm}>
        <div className='mt-2 text-xs md:text-sm lg:text-base'>
          <label htmlFor='password' className='block'>
            Old Password
          </label>
          <PasswordInput
            input='p-2'
            container='mt-1 rounded overflow-hidden'
            name='oldPassword'
          />
        </div>
        <div className='mt-2 text-xs md:text-sm lg:text-base'>
          <label htmlFor='password' className='block'>
            New Password
          </label>
          <PasswordInput
            input='p-2'
            container='mt-1 rounded overflow-hidden'
            name='newPassword'
          />
        </div>
        <button
          type='submit'
          className={`bg-[var(--primary)] text-white w-full p-2 rounded mt-2 capitalize hover:bg-indigo-200 ${
            submitting && "bg-[var(--hoverColor)] cursor-wait"
          }`}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  )
}

export default ChangePassword
