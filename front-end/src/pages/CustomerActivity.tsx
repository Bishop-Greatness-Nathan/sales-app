import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import {
  LoaderFunction,
  LoaderFunctionArgs,
  useLoaderData,
  useParams,
} from "react-router-dom"
import customFetch from "../utils/customFetch"
import { CustomerType, OrderType } from "../utils/types"
import { useDashboardContext } from "./DashboardLayout"
import { useOrders } from "../queries/orders"
import SingleOrder from "../components/SingleOrder"
import ReturnItemModal from "../components/modals/ReturnItemModal"
import dayjs from "dayjs"

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  try {
    const {
      data: { customers },
    } = await customFetch.get("/customer")

    const customer = customers.find(
      (customer: CustomerType) => customer._id === params.id
    )
    return customer
  } catch (error) {
    return error
  }
}

function CustomerActivity() {
  const { showReturnItemModal } = useDashboardContext()
  const customer = useLoaderData() as CustomerType
  const [customerOrders, setCustomerOrders] = useState<OrderType[]>([])
  const { id } = useParams()
  const [queryDate] = useState({
    from: "2000-01-01",
    to: dayjs(new Date(Date.now())).format("YYYY-MM-DD"),
  })
  const { data, isLoading, isError, error } = useOrders({
    from: queryDate.from,
    to: queryDate.to,
    userId: "all",
  })

  const loadPage = async () => {
    const customerOrders = data?.orders?.filter(
      (order: OrderType) => order.customer._id === id
    )
    setCustomerOrders(customerOrders)
  }

  useEffect(() => {
    if (data) loadPage()
  }, [data])

  if (isLoading) return <Loading />

  if (isError) return <h1>{error.message}</h1>
  return (
    <main>
      <h1 className='capitalize text-sm md:text-2xl lg:text-3xl font-bold'>
        {customer.firstName + " " + customer.lastName + "'s"} Orders
      </h1>
      {/* HEADER */}

      <h2 className='mt-5 md:mt-10 text-right text-sm md:text-base font-bold'>
        Total Debt -{" "}
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(customer?.debt || 0)}
      </h2>

      {customerOrders.length < 1 ? (
        <h1 className='text-center font-bold mt-5'>No activities</h1>
      ) : (
        <>
          {customerOrders.map((order: OrderType) => (
            <SingleOrder key={order._id} {...order} />
          ))}
        </>
      )}
      {showReturnItemModal && <ReturnItemModal />}
    </main>
  )
}

export default CustomerActivity
