import { FormEvent, useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { isAxiosError } from "axios"
import FormSelect from "../components/FormSelect"
import { useUpdateProduct, useGetSingleProduct } from "../queries/products"
import { useCategoryQuery } from "../queries/categories"
import Loading from "../components/Loading"
import { useDashboardContext } from "./DashboardLayout"

function UpdateProduct() {
  const { createEndOfDay } = useDashboardContext()
  const [add, setAdd] = useState(0)
  const [newQty, setNewQty] = useState(0)

  const navigate = useNavigate()
  const { id } = useParams()

  const {
    data: categories,
    isLoading: categoryLoading,
    isError: isCategoryError,
  } = useCategoryQuery()

  const { mutate, isError, isPending, isSuccess, error } = useUpdateProduct()

  const {
    data: product,
    isLoading,
    isError: productError,
  } = useGetSingleProduct(id as string)

  const newCategories = categories?.map((category) => category.name)

  function getNewQty() {
    const newQty = Number(product?.qty) + Number(add)
    setNewQty(newQty)
  }

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate({ id, data })
  }

  // responses
  const responses = () => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
    if (isSuccess) {
      toast.success("Product details updated")
      createEndOfDay()
      navigate("/dashboard/products")
    }
  }

  useEffect(() => {
    responses()
  }, [isError, isSuccess])

  useEffect(() => {
    getNewQty()
  }, [product, add])

  if (isLoading || categoryLoading) return <Loading />

  if (productError || isCategoryError) return <h1>There was an error...</h1>

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        Update Product
      </h1>
      <section className='bg-[var(--bgColor)] px-2 py-5 rounded-md'>
        <form
          onSubmit={handleSubmit}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-2'
        >
          <div className='w-full mt-3'>
            <label className='capitalize block'>name</label>
            <input
              type='text'
              name='name'
              required
              defaultValue={product?.name}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>cost price</label>
            <input
              type='number'
              name='CP'
              required
              defaultValue={product?.CP}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>selling price</label>
            <input
              type='number'
              name='SP'
              required
              defaultValue={product?.SP}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>minimum quantity</label>
            <input
              type='number'
              name='minimumQty'
              required
              defaultValue={product?.minimumQty}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>maximum quantity</label>
            <input
              type='number'
              name='maximumQty'
              required
              defaultValue={product.maximumQty}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>initial qty</label>
            <input
              type='number'
              required
              defaultValue={product.qty}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              readOnly
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>add</label>
            <input
              type='number'
              required
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) => setAdd(Number(e.target.value))}
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>new qty</label>
            <input
              type='number'
              name='qty'
              required
              value={newQty}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              readOnly
            />
          </div>
          <FormSelect
            name='category'
            defaultValue={product.category}
            list={newCategories || []}
            extraStyle='mt-2'
          />

          <button
            type='submit'
            disabled={isPending}
            className={`bg-[var(--primary)] p-2 rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end ${
              isPending && "cursor-wait"
            }`}
          >
            Edit Product
          </button>
        </form>
      </section>
    </main>
  )
}

export default UpdateProduct
