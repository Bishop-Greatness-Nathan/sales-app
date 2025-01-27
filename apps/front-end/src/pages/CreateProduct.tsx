import { FormEvent, useEffect } from "react"
import FormRow from "../components/FormRow"
import FormSelect from "../components/FormSelect"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useAddProduct } from "../queries/products"
import { useCategoryQuery } from "../queries/categories"
import Loading from "../components/Loading"
import { useDashboardContext } from "./DashboardLayout"

function CreateProduct() {
  const { createEndOfDay } = useDashboardContext()
  const {
    data: categories,
    isLoading,
    isError: categoryError,
  } = useCategoryQuery()
  const { mutate, isError, error, isSuccess, isPending } = useAddProduct()

  const newCategories = categories?.map((category) => category.name)

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate(data)
  }

  // responses
  const responses = () => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
    if (isSuccess) {
      toast.success("Successful. Create another product")
      createEndOfDay()
      location.reload()
    }
  }

  useEffect(() => {
    responses()
  }, [isError, isSuccess])

  if (isLoading) return <Loading />

  if (categoryError) return <h1>There was an error...</h1>

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        Create Product
      </h1>
      <section className='bg-white px-2 py-5 rounded-md shadow'>
        <form
          onSubmit={handleSubmit}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-2'
        >
          <FormRow type='text' labelText='name' name='name' required />
          <FormRow type='number' labelText='quantity' name='qty' required />
          <FormRow type='number' labelText='cost price' name='CP' required />
          <FormRow type='number' labelText='selling price' name='SP' required />
          <FormRow
            type='number'
            labelText='minimum quantity'
            name='minimumQty'
            required
          />
          <FormRow
            type='number'
            labelText='maximum quantity'
            name='maximumQty'
            required
          />
          <FormRow
            type='number'
            labelText='warehouse quantity'
            name='store'
            required
          />
          <FormSelect name='category' list={newCategories || []} required />

          <button
            type='submit'
            disabled={isPending}
            className={`bg-[var(--primary)] p-3 rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end ${
              isPending && "cursor-wait"
            }`}
          >
            Create Product
          </button>
        </form>
      </section>
    </main>
  )
}

export default CreateProduct
