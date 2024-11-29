import { OrderItemsType } from "../utils/types"
import { useCreateOrderContext } from "../pages/CreateOrder"
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa6"

function OrderItems({ productId, name, price, subTotal, pcs }: OrderItemsType) {
  const { decrement, increment, deleteItem, openEditOrderPrice } =
    useCreateOrderContext()
  return (
    <div
      key={productId}
      className='grid grid-cols-5 text-left capitalize mt-2 md:mt-3 lg:mt-5 bg-white p-1 shadow'
    >
      <h2 className='col-span-2 text-left text-[8px] md:text-xs lg:text-base'>
        {name}
      </h2>
      <h2
        className='cursor-pointer hover:bg-blue-200 hover:text-white text-[8px] md:text-xs lg:text-base'
        onClick={() => openEditOrderPrice(productId as string)}
      >
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(price)}
      </h2>
      <div className='grid grid-cols-5 items-center text-[8px] md:text-xs lg:text-base'>
        <button onClick={() => decrement(productId as string)}>
          <FaMinus />
        </button>
        <h2 className='font-bold bg-white'>{pcs}</h2>
        <button onClick={() => increment(productId as string)}>
          <FaPlus />
        </button>
      </div>
      <div className='flex justify-between text-[8px] md:text-xs lg:text-base'>
        <h2>
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(subTotal)}
        </h2>

        <button
          className='text-red-700'
          onClick={() => deleteItem(productId as string)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  )
}

export default OrderItems
