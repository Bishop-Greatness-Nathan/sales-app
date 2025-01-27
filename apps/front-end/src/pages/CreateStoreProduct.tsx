import { FormEvent, useEffect, useState } from "react"
import FormRow from "../components/FormRow"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import { useCreateStoreProduct } from "../queries/store"
import SearchProductModal from "../components/modals/SearchProductModal"

function CreateStoreProduct() {
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const { mutate, isPending, isError, error, isSuccess } =
    useCreateStoreProduct()

  const navigate = useNavigate()

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate(data)
  }

  // responses
  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) toast.error(error?.response?.data?.msg)
    } else if (isSuccess) {
      toast.success("Store product created")
      navigate("/dashboard/store")
    }
  }, [isError, isSuccess])

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        New Warehouse Product
      </h1>
      <section className='bg-[var(--bgColor)] px-2 py-5 rounded-md w-full m-auto'>
        <form onSubmit={handleSubmit} className='w-full'>
          <div className='text-xs md:text-base mt-2'>
            <label className='block'>Search Product</label>
            <input
              type='text'
              name='name'
              className='w-full p-[9px] mt-1 border outline-none rounded'
              autoFocus
              placeholder='search product'
              value={selectedProduct}
              onClick={() => setShowProductModal(true)}
              readOnly
            />
          </div>
          <FormRow type='number' labelText='quantity' name='store' required />
          <button
            type='submit'
            disabled={isPending}
            className={`bg-[var(--primary)] w-full mt-2 p-2 rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end ${
              isPending && "cursor-wait"
            }`}
          >
            Add To Warehouse
          </button>
        </form>
      </section>
      {showProductModal && (
        <SearchProductModal
          setShowProductModal={setShowProductModal}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </main>
  )
}

export default CreateStoreProduct
