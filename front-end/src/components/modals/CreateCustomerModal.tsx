import { ChangeEvent, useEffect } from "react"
import FormRow from "../FormRow"
import { FaTimes } from "react-icons/fa"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useDashboardContext } from "../../pages/DashboardLayout"
import { useCreateCustomer } from "../../queries/customers"

function CreateCustomerModal() {
  const { setShowCreateCustomerModal } = useDashboardContext()

  const { mutate, isPending, isError, error, isSuccess } = useCreateCustomer()

  // handle submit
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate(data)
  }
  // responses
  const response = () => {
    if (isError) {
      if (isAxiosError(error)) toast.error(error?.response?.data?.msg)
    }
    if (isSuccess) {
      toast.success("Customer added")
      setShowCreateCustomerModal(false)
    }
  }
  useEffect(() => {
    response()
  }, [isError, isSuccess])
  return (
    <main className='blured-bg fixed top-0 left-0 flex justify-center items-center w-full h-full z-10'>
      <div className='bg-white py-2 px-1 rounded text-[8px] md:text-xs lg:text-base w-[80%] md:w-[40%] relative'>
        <button
          className='absolute top-[-20px] right-[-20px] bg-white p-1 rounded-full'
          onClick={() => setShowCreateCustomerModal(false)}
        >
          <FaTimes />
        </button>
        <h1 className='text-center font-semibold text-xl'>Add New Customer</h1>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col space-y-5 w-full p-5'
        >
          <FormRow
            type='text'
            labelText='first name'
            name='firstName'
            required
          />
          <FormRow type='text' labelText='last name' name='lastName' required />
          <FormRow
            type='tel'
            labelText='phone number'
            name='phoneNumber'
            maxLength={11}
            minLength={11}
            required
          />

          <button
            type='submit'
            disabled={isPending}
            className={`bg-[var(--primary)] p-[10px] rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 ${
              isPending && "cursor-wait"
            }`}
          >
            Add Customer
          </button>
        </form>
      </div>
    </main>
  )
}

export default CreateCustomerModal
