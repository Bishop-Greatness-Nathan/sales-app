import { FormEvent, useState, useEffect } from "react"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import {
  useNavigate,
  useParams,
  useLoaderData,
  LoaderFunction,
  LoaderFunctionArgs,
} from "react-router-dom"
import axios from "axios"
import { ProductTypes } from "../utils/types"
import { useUpdateStoreProduct } from "../queries/store"
import { useDashboardContext } from "./DashboardLayout"

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  try {
    const {
      data: { product },
    } = await customFetch.get(`/product/${params.id}`)
    return product
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data?.msg)
    }
  }
}

function UpdateStoreProduct() {
  const { createEndOfDay } = useDashboardContext()
  const product = useLoaderData() as ProductTypes
  const [storeProduct, setStoreProduct] = useState({
    name: product.name,
    CP: product.CP,
    SP: product.SP,
    qty: product.store,
    add: 0,
    release: 0,
    newQty: 0,
  })
  const navigate = useNavigate()
  const { id } = useParams()

  const { mutate, isError, isPending, isSuccess, error } =
    useUpdateStoreProduct()

  function getNewQty() {
    const newQty =
      Number(storeProduct.qty) +
      Number(storeProduct.add) -
      Number(storeProduct.release)
    setStoreProduct({ ...storeProduct, newQty })
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
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
    if (isSuccess) {
      toast.success("Store Product updated")
      createEndOfDay()
      navigate("/dashboard/store")
    }
  }

  useEffect(() => {
    responses()
  }, [isError, isSuccess])

  useEffect(() => {
    getNewQty()
  }, [storeProduct.add, storeProduct.release])

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        Edit Store Product
      </h1>
      <section className='bg-white px-2 py-5 rounded-md'>
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
              value={storeProduct.name}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({ ...storeProduct, name: e.target.value })
              }
              readOnly
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>cost price</label>
            <input
              type='number'
              name='CP'
              required
              value={storeProduct.CP}
              readOnly
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>selling price</label>
            <input
              type='number'
              name='SP'
              required
              value={storeProduct.SP}
              readOnly
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>initial qty</label>
            <input
              type='number'
              required
              value={storeProduct.qty}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              readOnly
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>add</label>
            <input
              type='number'
              required
              value={storeProduct.add}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({
                  ...storeProduct,
                  add: Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>release</label>
            <input
              type='number'
              name='release'
              required
              value={storeProduct.release}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({
                  ...storeProduct,
                  release: Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>new qty</label>
            <input
              type='number'
              name='store'
              required
              value={storeProduct.newQty}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              readOnly
            />
          </div>

          <button
            type='submit'
            disabled={isPending}
            className={`bg-blue-500 p-2 rounded text-white hover:bg-blue-700 ease-in-out duration-300 self-end ${
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

export default UpdateStoreProduct
