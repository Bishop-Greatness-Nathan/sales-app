import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import FormRow from "../components/FormRow"
import PasswordInput from "../components/PasswordInput"
import customFetch from "../utils/customFetch"
import axios from "axios"
import { toast } from "react-toastify"

function Register() {
  const [isSubmitting, setIsSubmitting] = useState("")
  const navigate = useNavigate()

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting("submitting")
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    try {
      await customFetch.post("/auth/register", data)
      navigate("/login")
      toast.success("Account created")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
        navigate("/")
      }
    }
  }

  return (
    <div className='pb-[3rem] w-full h-full overflow-auto'>
      <div className='bg-white w-[90%] m-auto mt-[50px] rounded border-t-4 border-[var(--primary)] p-5 shadow-md shadow-slate-300 md:w-[50%] lg:w-[40%]'>
        <Logo container='w-[100px] m-auto mb-2' />
        <h2 className='text-center text-xl mb-10'>Register</h2>
        <form onSubmit={handleSubmit}>
          <FormRow
            type='text'
            labelText='first name'
            name='firstName'
            extraStyle='capitalize'
            required
          />
          <FormRow
            type='text'
            labelText='last name'
            name='lastName'
            extraStyle='capitalize'
            required
          />
          <FormRow
            type='text'
            labelText='branch'
            name='branch'
            extraStyle='capitalize'
            required
          />
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
              isSubmitting && "bg-[var(--hoverColor)] cursor-wait"
            }`}
            disabled={isSubmitting === "submitting"}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        <p className='text-center mt-3 mb-3'>
          Already a member?{" "}
          <Link to='/login' className='text-green-600'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
