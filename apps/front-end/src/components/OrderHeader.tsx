import React from "react"
import { CustomerType, OrderItemsType } from "../utils/types"

function OrderHeader({
  customer,
  orderItems,
  showMore,
  total,
  new_date,
  setShowMore,
  createdAt,
}: {
  customer: CustomerType
  orderItems: OrderItemsType[]
  total: number
  new_date: Date
  showMore: boolean
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>
  createdAt: string
}) {
  return (
    <div
      className={`flex justify-between mt-2 rounded shadow text-[8px] md:text-base p-1 md:p-2  ${
        showMore
          ? "bg-blue-300 text-white font-semibold rounded-none"
          : "bg-white"
      }`}
    >
      <p className={`${showMore ? "col-span-3" : "col-span-2"} p-1 md:p-2`}>
        {showMore && "Customer: "}
        {`${
          customer?.firstName.length > 1
            ? customer?.firstName + " " + customer?.lastName
            : "Anonymous"
        }`}
      </p>
      <p className='col-span-1 p-1 md:p-2'>
        {orderItems.length} item{orderItems.length > 1 ? "s" : ""}
      </p>
      <p className={`col-span-2 p-1 md:p-2 ${showMore && "hidden"}`}>
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(total)}
      </p>
      <p className={`${showMore ? "col-span-2" : "col-span-1"} p-1 md:p-2`}>
        <span>
          {showMore
            ? new Intl.DateTimeFormat(undefined, {
                dateStyle: "long",
              }).format(new_date)
            : new Intl.DateTimeFormat("es", { dateStyle: "short" }).format(
                new_date
              )}
        </span>{" "}
        <span className='font-normal'>
          {createdAt ? new Date(createdAt as string).toLocaleTimeString() : ""}
        </span>
      </p>

      <button
        className={`p-1 md:p-2 ${
          showMore ? "text-red-700" : "text-blue-500"
        } hover:text-blue-700`}
        onClick={() => {
          setShowMore(!showMore)
        }}
      >
        {showMore ? "close" : "view"}
      </button>
    </div>
  )
}

export default OrderHeader
