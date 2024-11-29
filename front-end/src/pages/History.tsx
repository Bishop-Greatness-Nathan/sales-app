import { useState, FormEvent } from "react"
import { OrderItemsType, OrderType } from "../utils/types"
import SearchHistoryForm from "../components/SearchHistoryForm"
import SearchProductModal from "../components/modals/SearchProductModal"
import SingleOrder from "../components/SingleOrder"
import { useOrders } from "../queries/orders"
import { useDashboardContext } from "./DashboardLayout"
import ReturnItemModal from "../components/modals/ReturnItemModal"
import dayjs from "dayjs"

function History() {
  const { showReturnItemModal } = useDashboardContext()
  const [totalSold, setTotalSold] = useState(0)
  const [date, setDate] = useState("")
  const [queryDate, setQueryDate] = useState({
    from: dayjs(new Date(Date.now())).format("YYYY-MM-DD"),
    to: dayjs(new Date(Date.now())).format("YYYY-MM-DD"),
  })
  const [orders, setOrders] = useState<OrderType[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")

  const {
    data,
    // isLoading,
    isError,
    error,
  } = useOrders({ from: queryDate.from, to: queryDate.to, userId: "all" })

  // Submit form
  const searchHistory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const from = new FormData(e.currentTarget).get("from")
    const to = new FormData(e.currentTarget).get("to")
    const product = new FormData(e.currentTarget).get("product")

    if (from === null || to === null || product === null) {
      console.error("Date range is not specified")
      return
    }
    const newFrom = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(from as string))
    const newTo = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(to as string))

    setDate(`${newFrom} - ${newTo}`)

    // get orders
    const newOrders = data
      ? data.orders?.filter((order: OrderType) => {
          let itemName = order?.orderItems.find((item) => item.name === product)

          if (itemName?.name === product) {
            return order
          }
          return null
        })
      : []
    setOrders(newOrders)

    // total qty sold
    let emptyArray: OrderItemsType[] = []

    newOrders.forEach((order: OrderType) => {
      order.orderItems.forEach((item) => {
        if (item.name === product) {
          emptyArray.push(item)
        }
      })
    })

    let totalSold = emptyArray.reduce((total, item) => {
      total += item.pcs
      return total
    }, 0)
    setTotalSold(totalSold)
  }

  if (isError) return <h1>{error.message}</h1>

  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 mt-5'>
        Product Sales History
      </h1>

      <section className='pb-5'>
        <div className='bg-white p-2 rounded-md py-3 shadow'>
          <SearchHistoryForm
            searchHistory={searchHistory}
            selectedProduct={selectedProduct}
            setShowProductModal={setShowProductModal}
            setQueryDate={setQueryDate}
            queryDate={queryDate}
            setOrders={setOrders}
          />
        </div>

        {/* MODAL */}

        {showProductModal && (
          <SearchProductModal
            setShowProductModal={setShowProductModal}
            setSelectedProduct={setSelectedProduct}
          />
        )}

        <>
          {orders.length > 0 && (
            <div className='flex items-center justify-between mt-5 text-[9px] md:text-sm lg:text-base px-2'>
              <h1>
                Appeared in{" "}
                <span className='text-blue-800 font-semibold'>
                  {orders.length} Order{orders.length > 1 && "s"}
                </span>{" "}
                for <span className='text-blue-800 font-semibold'>{date}</span>
              </h1>

              <h1 className='text-blue-800 font-bold'>Qty Sold: {totalSold}</h1>
            </div>
          )}

          {/* HEADER */}
          {orders.length < 1 ? (
            <h1 className='text-center font-semibold mt-10'>
              No orders found. Enter product and date to get history
            </h1>
          ) : (
            <>
              <div>
                {orders?.map((order) => {
                  return <SingleOrder key={order._id} {...order} />
                })}
              </div>
            </>
          )}
        </>
      </section>
      {showReturnItemModal && <ReturnItemModal />}
    </main>
  )
}

export default History
