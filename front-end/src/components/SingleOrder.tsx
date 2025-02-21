import { useState, useEffect } from "react"
import { OrderType } from "../utils/types"
import SingleOrderItem from "./SingleOrderItem"
import customFetch from "../utils/customFetch"
import OrderHeader from "./OrderHeader"
import OrderTableHead from "./OrderTableHead"
import OrderFooter from "./OrderFooter"

function SingleOrder({
  _id,
  total,
  orderItems,
  customer,
  enteredAt,
  balance,
  createdAt,
}: OrderType) {
  const new_date = new Date(enteredAt)
  const [soldBy, setSoldBy] = useState("")
  const [showMore, setShowMore] = useState(false)

  const getSoldBy = async () => {
    try {
      const {
        data: { soldBy },
      } = await customFetch.get(`/order/${_id}`)
      setSoldBy(soldBy)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSoldBy()
  }, [])

  return (
    <main className='mt-3'>
      {/* Heading */}
      <OrderHeader
        customer={customer}
        showMore={showMore}
        setShowMore={setShowMore}
        orderItems={orderItems}
        total={total}
        new_date={new_date}
        createdAt={createdAt as string}
      />
      <section
        className={`${
          showMore
            ? "h-[160px] md:h-[200px] overflow-auto ease-in-out duration-300"
            : "h-0 overflow-auto ease-in-out duration-300"
        } ease-in-out duration-200 `}
      >
        <OrderTableHead />

        {/* BODY */}
        <div className='bg-white rounded-md shadow-md'>
          {orderItems?.map((item) => {
            return (
              <SingleOrderItem key={item.productId} {...item} orderId={_id} />
            )
          })}
        </div>

        <OrderFooter
          soldBy={soldBy}
          total={total}
          balance={balance as number}
          _id={_id}
        />
      </section>
    </main>
  )
}

export default SingleOrder
