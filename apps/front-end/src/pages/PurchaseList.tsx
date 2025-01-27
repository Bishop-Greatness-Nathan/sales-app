import { ChangeEvent, useEffect, useState } from "react"
import Loading from "../components/Loading"
import Filter from "../components/Filter"
import { useProductQuery } from "../queries/products"

type ProductListType = {
  name: string
  listItemQty: number
  listItemCost: number
  category: string
}

function PurchaseList() {
  const [allProducts, setAllProducts] = useState<ProductListType[]>([])
  const [products, setProducts] = useState<ProductListType[]>([])
  const [totalCost, setTotalCost] = useState(0)
  const [productCategory] = useState("All Products")

  const { data, isLoading, isError, error } = useProductQuery(
    "All Products",
    productCategory
  )

  // get product list
  const getProductList = async () => {
    const productList = data?.products.map((product) => {
      const listItemQty: number =
        product.maximumQty && product.maximumQty > product.qty
          ? product.maximumQty - product.qty
          : 0
      const listItemCost: number = listItemQty * product.CP
      return {
        name: product.name,
        listItemQty,
        listItemCost,
        category: product.category,
      }
    })
    setAllProducts(productList as ProductListType[])
    setProducts(productList as ProductListType[])
  }

  // calculate total cost
  const calcTotalCost = () => {
    const totalCost = products.reduce((total, product) => {
      total += product.listItemCost
      return total
    }, 0)

    setTotalCost(totalCost)
  }

  // Create filter buttons
  const filterBtns = [
    "All",
    ...new Set(allProducts.map((product) => product.category)),
  ]

  // Filter Products
  const filterFunction = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const filteredProducts = allProducts.filter((product) => {
      if (value === "All") {
        return products
      } else if (product.category === value) {
        return product
      }
    })
    setProducts(filteredProducts)
  }

  useEffect(() => {
    if (data) getProductList()
  }, [data])

  useEffect(() => {
    calcTotalCost()
  }, [products])

  if (isLoading) return <Loading />

  if (isError) return <h1>{error.message}</h1>

  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-3 mt-5 font-bold'>
        Purchase List
      </h1>

      <Filter
        filterBtns={filterBtns}
        filterFunction={filterFunction as () => void}
      />

      <div className='bg-white'>
        {/* TABLE HEAD */}
        <div className='grid grid-cols-4 border font-bold sticky top-[80px] md:top-[100px] z-10 bg-white'>
          <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-2'>
            Product Name
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base border-l text-center p-2'>
            Quantity
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            Cost
          </h2>
        </div>

        {/* TABLE BODY */}
        <>
          {products.map((product) => {
            if (product.listItemQty > 0) {
              return (
                <div
                  key={product.name}
                  className='grid grid-cols-4 border capitalize'
                >
                  <p className='col-span-2 text-[8px] md:text-xs lg:text-base p-2 border-l'>
                    {product.name}
                  </p>
                  <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
                    {new Intl.NumberFormat().format(product.listItemQty)}
                  </p>
                  <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
                    {new Intl.NumberFormat().format(product.listItemCost)}
                  </p>
                </div>
              )
            }
          })}
        </>

        {/* TOTAL ROW */}
        <div className='grid grid-cols-4 border capitalize '>
          <p className='col-span-3 text-[8px] md:text-xs lg:text-base p-2 border-l font-bold'>
            TOTAL
          </p>
          <p className='text-[8px] md:text-xs lg:text-base p-2 border-l font-bold text-center'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(totalCost)}
          </p>
        </div>
      </div>
    </main>
  )
}

export default PurchaseList
