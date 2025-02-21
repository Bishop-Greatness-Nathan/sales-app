import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import FormRow from "../components/FormRow"
import { toast } from "react-toastify"
import axios from "axios"
import PasswordInput from "../components/PasswordInput"
import customFetch from "../utils/customFetch"

function ForgotPassword() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      // forgotPassword(data)
      await customFetch.post("/auth/forgot-password", data)
      toast.success("Password changed successfully")
      navigate("/login")
      setSubmitting(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        setSubmitting(false)
      }
    }
  }

  return (
    <div className='pb-[3rem] w-full h-full overflow-auto'>
      <div className='bg-[var(--bgColor)] w-[90%] m-auto mt-[100px] rounded border-t-4 border-[var(--primary)] p-5 shadow-md shadow-slate-300 md:w-[50%] lg:w-[40%]'>
        <Logo container='w-[100px] m-auto mb-2' />
        <h2 className='text-center text-xl mb-10'>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <FormRow type='text' labelText='username' name='userName' required />
          <div className='mt-2 text-xs md:text-sm lg:text-base'>
            <label htmlFor='password' className='block'>
              Password
            </label>
            <PasswordInput
              input='p-2'
              container='mt-1 rounded overflow-hidden'
              name='password'
            />
          </div>
          <div className='mt-2 text-xs md:text-sm lg:text-base'>
            <label htmlFor='password' className='block'>
              Confirm Password
            </label>
            <PasswordInput
              input='p-2'
              container='mt-1 rounded overflow-hidden'
              name='confirmPassword'
            />
          </div>

          <button
            type='submit'
            disabled={submitting}
            className={`text-white bg-[var(--primary)] w-full p-2 rounded mt-4 cursor-pointer hover:bg-[var(--hoverColor)] ease-in-out duration-300 ${
              submitting && "bg-[var(--hoverColor)] cursor-wait"
            }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <p className='text-center mt-3 mb-3'>
            <Link to='/' className='text-green-600'>
              Home Page
            </Link>
          </p>
          <p className='text-center mt-3 mb-3'>
            <Link to='/login' className='text-green-600'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
