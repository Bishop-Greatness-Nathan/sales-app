import { useState, MouseEvent, ChangeEvent, useEffect } from "react"
import { useCreateOrderContext } from "../../pages/CreateOrder"
import { FaTimes } from "react-icons/fa"
import { useProductQuery } from "../../queries/products"
import { toast } from "react-toastify"

function OrderProductModal() {
  const { setShowProductModal, orderItems, setOrderItems } =
    useCreateOrderContext()
  const [productNames, setProductNames] = useState<string[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<string[]>([])

  const { data, isLoading, isError, error } = useProductQuery(
    "All Products",
    "All Products"
  )

  function selectName(e: MouseEvent<HTMLElement>) {
    const value = e.currentTarget.textContent
    const orderItem = data?.products.find((product) => product.name === value)
    if (!orderItem) throw new Error("product does not exist")
    const alreadySelected = orderItems.find((item) => item.name === value)
    if (alreadySelected) {
      toast.error("Item already selected")
      return
    }
    setOrderItems([
      ...orderItems,
      {
        name: orderItem.name,
        cost: orderItem.CP,
        price: orderItem.SP,
        pcs: 1,
        subTotal: orderItem.SP,
        returned: 0,
        diff: 0,
        productId: orderItem._id,
      },
    ])
    setShowProductModal(false)
  }

  function filterList(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    const inputValue = input.toLowerCase()
    const filteredValue = productNames.filter((product) => {
      if (inputValue === "") {
        return product
      } else if (product.toLowerCase().includes(inputValue)) {
        return product
      }
    })
    setDisplayedProducts(filteredValue)
  }

  useEffect(() => {
    if (data) {
      const productNames = data?.products.map((product) => product.name).sort()
      setDisplayedProducts(productNames)
      setProductNames(productNames)
    }
  }, [data])

  if (isError) return <h1 className='bg-white text-center'>{error.message}</h1>
  return (
    <main className='blured-bg fixed top-0 left-0 flex justify-center items-center w-full h-full z-10'>
      <div className='w-[80%] md:w-[60%] h-[80%] bg-white rounded-md p-5 relative'>
        <input
          type='text'
          autoFocus
          className='w-full mb-2 p-2 rounded outline-none border-2 border-[var(--primary)]'
          onChange={filterList}
          placeholder='search product name'
        />
        {isLoading ? (
          <h1 className='mt-5'>Loading products...</h1>
        ) : (
          <div className='h-[90%] overflow-auto'>
            {displayedProducts.map((product) => {
              return (
                <p
                  key={product}
                  className='hover:bg-blue-50 mb-1 leader p-1 cursor-pointer'
                  onClick={selectName}
                >
                  {product}
                </p>
              )
            })}
          </div>
        )}
        <button
          className='absolute top-[-20px] right-[-20px] p-1 bg-white rounded-full'
          onClick={() => setShowProductModal(false)}
        >
          <FaTimes />
        </button>
      </div>
    </main>
  )
}

export default OrderProductModal
