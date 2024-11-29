import { useDashboardContext } from "../pages/DashboardLayout"
import { OrderItemsType } from "../utils/types"
import { BsArrowReturnLeft } from "react-icons/bs"
function SingleOrderItem({
  name,
  price,
  pcs,
  subTotal,
  returned,
  orderId,
  _id,
}: OrderItemsType) {
  const { currentUser, setShowReturnItemModal, setIDs, IDs } =
    useDashboardContext()
  return (
    <div className={`grid grid-cols-10 gap-2 }`}>
      <h2 className='col-span-3 p-2 capitalize text-[8px] md:text-base'>
        {name}
      </h2>
      <h2 className='p-2 text-[8px] md:text-base'>{pcs}</h2>
      <h2 className='col-span-2 p-2 text-[8px] md:text-base'>
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(price)}
      </h2>
      <h2 className='col-span-2 p-2 text-[8px] md:text-base'>
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(subTotal)}
      </h2>
      <div
        className={
          "col-span-2 p-2 flex justify-between items-center text-[8px] space-x-1 md:text-base "
        }
      >
        <h2
          className={` ${
            returned
              ? "text-red-600 font-bold text-center"
              : "text-black font-normal text-center"
          }`}
        >
          {new Intl.NumberFormat().format(returned) || 0}
        </h2>
        <button
          onClick={() => {
            setShowReturnItemModal(true)
            setIDs({
              ...IDs,
              orderId: String(orderId),
              itemId: _id as string,
            })
          }}
        >
          {currentUser.role === "admin" && pcs > 0 && <BsArrowReturnLeft />}
        </button>
      </div>
    </div>
  )
}

export default SingleOrderItem
