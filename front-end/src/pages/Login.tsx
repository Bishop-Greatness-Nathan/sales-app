import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import FormRow from "../components/FormRow"
import Logo from "../components/Logo"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import axios from "axios"
import PasswordInput from "../components/PasswordInput"

function Login() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  // END OF DAY
  const createEndOfDay = async () => {
    try {
      await customFetch.get("/endofday/new")
    } catch (error) {
      return error
    }
  }

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    try {
      await customFetch.post("/auth/login", data)
      toast.success("Login Successful")
      navigate("/dashboard/create-order")
      setSubmitting(false)
      createEndOfDay()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
        setSubmitting(false)
      }
    }
  }

  return (
    <div className='pb-[3rem] w-full h-full overflow-auto'>
      <div className='bg-white w-[90%] m-auto mt-[100px] rounded border-t-4 border-[var(--primary)] p-5 shadow-md shadow-slate-300 md:w-[50%] lg:w-[40%]'>
        <Logo container='w-[100px] m-auto mb-2' />
        <h2 className='text-center text-xl mb-10'>Login</h2>
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
          <button
            type='submit'
            className={`text-white bg-[var(--primary)] w-full p-2 rounded mt-4 cursor-pointer hover:bg-[var(--hoverColor)] ease-in-out duration-300 ${
              submitting && "bg-[var(--hoverColor)] cursor-wait"
            }`}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <p className='text-center mt-3 mb-3'>
            Don't have an account?{" "}
            <Link to='/register' className='text-green-600'>
              Register
            </Link>
          </p>
          <p className='text-center mt-3 mb-3'>
            Forgot password?{" "}
            <Link to='/forgot-password' className='text-green-600'>
              Reset Password
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
