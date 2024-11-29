import { useState } from "react"
import SingleProduct from "../components/SingleProduct"
import { CategoryType, ProductTypes } from "../utils/types"
import { useDashboardContext } from "./DashboardLayout"
import SearchProductModal from "../components/modals/SearchProductModal"
import Loading from "../components/Loading"
import { useProductQuery } from "../queries/products"
import { useCategoryQuery } from "../queries/categories"

function AllProducts() {
  const { currentUser } = useDashboardContext()
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("All Products")
  const [productCategory, setProductCategory] = useState("All Products")

  const { data, isLoading, isError } = useProductQuery(
    selectedProduct,
    productCategory
  )

  const { data: categories } = useCategoryQuery()

  // Create filter buttons
  const filterBtns = [
    "All Products",
    ...new Set(categories?.map((category: CategoryType) => category.name)),
  ]

  if (isError) return <h1>There was an error...</h1>
  return (
    <main className='pb-10'>
      <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5'>All Products</h1>

      {/* FILTER BUTTONS */}
      <div className='flex justify-end items-center space-x-3 mb-3 mt-3 text-xs md:text-base'>
        <span className='font-semibold'>Filter: </span>

        <select
          className='border-none rounded p-1 outline-0'
          onChange={(e) => setProductCategory(e.target.value)}
        >
          {filterBtns.map((btn, index) => {
            return (
              <option key={index} value={btn}>
                {btn}
              </option>
            )
          })}
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <section className='bg-white p-2 py-5'>
            {/* WORTH */}
            {currentUser.role === "admin" && (
              <div className='text-right text-xs md:text-base'>
                <h2 className='text-[8px] md:text-xs lg:text-base'>
                  Total Cost -{" "}
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(data?.worth?.totalCost || 0)}
                </h2>
                <h2 className='text-[8px] md:text-xs lg:text-base'>
                  Total Worth -{" "}
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(data?.worth?.totalWorth || 0)}
                </h2>
              </div>
            )}

            {/* SEARH FORM */}
            <input
              type='text'
              name='product'
              className='p-1 md:p-2 outline-none text-xs md:text-base w-full rounded-[25px] border-2 border-[var(--primary)] mt-2'
              autoFocus
              placeholder='search product'
              value={selectedProduct}
              onClick={() => setShowProductModal(true)}
              readOnly
            />

            {showProductModal && (
              <SearchProductModal
                setShowProductModal={setShowProductModal}
                setSelectedProduct={setSelectedProduct}
              />
            )}
            {/* PRODUCTS SECTION*/}
            <h1 className='mt-5 text-xs md:text-sm lg:text-base'>
              Count:{" "}
              {new Intl.NumberFormat().format(
                Number(data && data?.products.length)
              )}{" "}
              product
              {data && data?.products?.length !== 1 ? "s" : ""}
            </h1>
            {/* HEADER */}
            <div className='grid grid-cols-7 border font-bold sticky top-[80px] md:top-[100px] z-10 bg-white'>
              <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-2 text-center'>
                Name
              </h2>
              <h2 className='text-[8px] md:text-xs  lg:text-base border-l text-center p-2'>
                CP
              </h2>
              <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
                SP
              </h2>
              <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
                Qty
              </h2>
              <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
                Cost
              </h2>
              <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
                Worth
              </h2>
            </div>
            {/* PRODUCTS */}
            {
              <div>
                {data?.products.map((product: ProductTypes) => {
                  return <SingleProduct key={product._id} {...product} />
                })}
              </div>
            }
          </section>
        </>
      )}
    </main>
  )
}

export default AllProducts
