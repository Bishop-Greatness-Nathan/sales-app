import { useEffect, useState, FormEvent, ChangeEvent } from "react"
import { useDashboardContext } from "./DashboardLayout"
import SearchOrderForm from "../components/SearchOrderForm"
import SingleOrder from "../components/SingleOrder"
import Loading from "../components/Loading"
import { OrderType, UserTypes } from "../utils/types"
import dayjs from "dayjs"
import Analysis from "../components/Analysis"
import ReturnItemModal from "../components/modals/ReturnItemModal"
import Filter from "../components/Filter"
import { useOrders } from "../queries/orders"
import { useUsers } from "../queries/users"

function AllOrders() {
  const { currentUser, showReturnItemModal } = useDashboardContext()
  const [date, setDate] = useState(
    dayjs(new Date(Date.now())).format("DD-MM-YYYY")
  )
  const [queryDate, setQueryDate] = useState({
    from: dayjs(new Date(Date.now())).format("YYYY-MM-DD"),
    to: dayjs(new Date(Date.now())).format("YYYY-MM-DD"),
  })
  const [userId, setUserId] = useState("all")

  const [filterBtns, setFilterBtns] = useState<string[]>([])
  const [users, setUsers] = useState<UserTypes[]>([])

  const { data, isLoading, isError, error } = useOrders({
    from: queryDate.from,
    to: queryDate.to,
    userId: userId,
  })

  const { data: allUsers } = useUsers()

  // FILTER ORDERS
  const searchOrders = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const from = new FormData(e.currentTarget).get("from")
    const to = new FormData(e.currentTarget).get("to")

    if (from === null || to === null) {
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
    setQueryDate({ ...queryDate, from: from as string, to: to as string })
  }

  // CREATE FILTER BUTTONS
  const createFilterBtns = async () => {
    const users = allUsers && currentUser.role === "admin" ? allUsers : []
    const filterBtns = [
      "All",
      ...new Set(users.map((user: UserTypes) => user.userName)),
    ]
    setFilterBtns(filterBtns as string[])
    setUsers(users)
  }

  // FILTER ORDERS
  const filterFunction = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "All" && currentUser.role === "admin") {
      setUserId("all")
    } else {
      const user =
        currentUser.role === "admin"
          ? users.find((user) => user.userName === value)
          : null
      setUserId(user?._id as string)
    }
  }

  // RESPONSES
  useEffect(() => {
    createFilterBtns()
  }, [allUsers])

  useEffect(() => {
    if (currentUser.role === "admin") {
      setUserId("all")
    } else {
      setUserId(currentUser._id as string)
    }
  }, [])

  if (isError) return <h1>{error.message}</h1>

  return (
    <main>
      <div className='flex justify-between'>
        <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5'>Orders</h1>
        {data && <Analysis analysis={data.analysis} />}
      </div>

      {currentUser.role === "admin" && (
        <Filter
          filterBtns={filterBtns as string[]}
          filterFunction={filterFunction as () => void}
        />
      )}
      <section className='pb-5'>
        <div className='bg-white p-2 rounded-md py-3 shadow'>
          <SearchOrderForm searchOrders={searchOrders} />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <h1 className='mt-5 text-xs md:text-sm lg:text-base'>
              Showing{" "}
              <span className='text-blue-800 font-semibold'>
                {data?.orders.length} Result{data?.orders.length > 1 && "s"}
              </span>{" "}
              for <span className='text-blue-800 font-semibold'>{date}</span>
            </h1>

            {/* HEADER */}
            {data?.orders.length < 1 ? (
              <h1 className='text-center font-bold'>No orders available</h1>
            ) : (
              <>
                <div>
                  {data?.orders.map((order: OrderType) => {
                    return <SingleOrder key={order._id} {...order} />
                  })}
                </div>
              </>
            )}
          </>
        )}
      </section>
      {showReturnItemModal && <ReturnItemModal />}
    </main>
  )
}

export default AllOrders
