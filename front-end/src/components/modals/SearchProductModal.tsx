import { useState, ChangeEvent, SetStateAction, useEffect } from "react"
import React from "react"
import { FaTimes } from "react-icons/fa"
import { useProductQuery } from "../../queries/products"
import { ProductTypes } from "../../utils/types"
function SearchProductModal({
  setShowProductModal,
  setSelectedProduct,
}: {
  setShowProductModal: React.Dispatch<SetStateAction<boolean>>
  setSelectedProduct: React.Dispatch<SetStateAction<string>>
}) {
  const [displayedProducts, setDisplayedProducts] = useState<string[]>([])

  const { data, isLoading, isError } = useProductQuery(
    "All Products",
    "All Products"
  )

  const productNames = [
    "All Products",
    ...(data?.products.map((product: ProductTypes) => product.name) || []),
  ].sort()

  // select product
  function selectName(name: string) {
    const product = data?.products.find((product) => product.name === name)

    setSelectedProduct((product?.name as string) || "All Products")
    setShowProductModal(false)
  }

  // filter list
  function filterList(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    const inputValue = input.toLowerCase()
    const filteredValue =
      (data &&
        data?.products
          .filter((product) => {
            if (inputValue === "") {
              return product
            } else if (product.name.toLowerCase().includes(inputValue)) {
              return product
            }
          })
          .map((product) => product.name)) ||
      []
    setDisplayedProducts(["All Products", ...filteredValue])
  }

  useEffect(() => {
    if (data) setDisplayedProducts(productNames)
  }, [data])

  if (isError) return <h1>There was an error...</h1>

  return (
    <main className='blured-bg fixed top-0 left-0 flex justify-center items-center w-full h-full z-20'>
      <div className='w-[80%] md:w-[60%] h-[80%] bg-white rounded-md p-5 relative'>
        <input
          type='text'
          autoFocus
          className='w-full mb-2 p-2 rounded outline-none border-2 border-[var(--primary)]'
          onChange={filterList}
          placeholder='search product name'
        />
        {isLoading ? (
          <h1 className='mt-2'>Loading...</h1>
        ) : (
          <div className='h-[90%] overflow-auto'>
            {displayedProducts.map((product) => {
              return (
                <p
                  key={product}
                  className='hover:bg-blue-50 mb-1 leader p-1 cursor-pointer'
                  onClick={() => selectName(product)}
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

export default SearchProductModal
