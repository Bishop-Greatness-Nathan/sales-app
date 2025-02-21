import { useParams, useNavigate } from "react-router-dom"
import FormRow from "../components/FormRow"
import { useEditCustomer, useSingleCustomer } from "../queries/customers"
import Loading from "../components/Loading"
import { ChangeEvent, useEffect } from "react"
import { isAxiosError } from "axios"
import { toast } from "react-toastify"

function EditCustomer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useSingleCustomer(id as string)

  const {
    mutate,
    isSuccess,
    isError: isEditError,
    error: editError,
    isPending,
  } = useEditCustomer()

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate({ id, data })
  }

  useEffect(() => {
    if (editError) {
      if (isAxiosError(editError)) toast.error(editError?.response?.data?.msg)
    }
    if (isSuccess) {
      toast.success("customer details updated")
      navigate("/dashboard/customers")
    }
  }, [isEditError, isSuccess])

  if (isLoading) return <Loading />

  if (isError) return <h1>{error.message}</h1>

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        Edit Customer Details
      </h1>
      <section className='bg-[var(--bgColor)] px-2 py-5 rounded-md'>
        <form
          onSubmit={handleSubmit}
          className='bg-[var(--bgColor)] px-2 py-5 rounded-md'
        >
          <FormRow
            type='text'
            labelText='first name'
            name='firstName'
            defaultValue={customer.firstName}
            required
          />
          <FormRow
            type='text'
            labelText='last name'
            name='lastName'
            defaultValue={customer.lastName}
            required
          />
          <FormRow
            type='tel'
            labelText='phone number'
            name='phoneNumber'
            defaultValue={customer.phoneNumber}
            maxLength={11}
            minLength={11}
            required
          />

          <button
            type='submit'
            disabled={isPending}
            className={`bg-[var(--primary)] p-[10px] rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 mt-5 w-full ${
              isPending && "cursor-wait"
            }`}
          >
            {isPending ? "Submitting" : "Submit"}
          </button>
        </form>
      </section>
    </main>
  )
}

export default EditCustomer
