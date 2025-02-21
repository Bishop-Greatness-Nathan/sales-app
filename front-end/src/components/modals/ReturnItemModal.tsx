import { ChangeEvent, useEffect, useState } from "react"
import { useDashboardContext } from "../../pages/DashboardLayout"
import { useReturnItem } from "../../queries/orders"
import { isAxiosError } from "axios"
import { toast } from "react-toastify"
import { OrderItemsType } from "../../utils/types"
import { FaTimes } from "react-icons/fa"
import customFetch from "../../utils/customFetch"

function ReturnItemModal() {
  const {
    showReturnItemModal,
    setShowReturnItemModal,
    IDs,
    setIDs,
    createEndOfDay,
  } = useDashboardContext()
  const [orderItem, setOrderItem] = useState({
    name: "",
    cost: 0,
    price: 0,
    pcs: 0,
    subTotal: 0,
    returned: 0,
    diff: 0,
    productId: "",
    _id: "",
    newQty: 0,
    newDiff: 0,
    returnType: "cash",
  })

  const [qty, setQty] = useState(orderItem.pcs || 0)

  const { mutate, isError, isSuccess, error, isPending } = useReturnItem()

  // handle submit
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (orderItem.returned === 0) {
      toast.error("returned quantity cannot be empty")
      return
    }
    mutate({ orderId: IDs.orderId, itemId: IDs.itemId, data: orderItem })
  }

  async function getOrder() {
    const {
      data: { order },
    } = await customFetch.get(`/order/${IDs.orderId}`)
    const item = order.orderItems.find(
      (item: OrderItemsType) => item._id === IDs.itemId
    )
    setOrderItem({ ...item, newQty: 0, newDiff: 0, returnType: "cash" })
  }

  useEffect(() => {
    getOrder()
  }, [showReturnItemModal])

  // responses
  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) toast.error(error?.response?.data?.msg)
      setShowReturnItemModal(false)
    }
    if (isSuccess) {
      if (isSuccess) toast.success("Item successfully returned")
      setIDs({ orderId: "", itemId: "" })
      createEndOfDay()
      setShowReturnItemModal(false)
    }
  }, [isError, isSuccess])

  useEffect(() => {
    if (orderItem) {
      const newDiff = (orderItem.diff / orderItem.pcs) * (orderItem.newQty || 0)
      setOrderItem({ ...orderItem, newDiff })
    }
  }, [qty])

  return (
    <main className='blured-bg fixed top-0 left-0  w-full h-[100vh] overflow-auto z-10 p-5 md:p-10'>
      <div className='bg-white w-full md:w-[50%] p-5 rounded-md relative m-auto mt-10'>
        <h2 className='text-center text-xl font-semibold'>Return Product</h2>

        <form onSubmit={handleSubmit}>
          <div className='w-full mt-2'>
            <label className='capitalize block'>Product</label>
            <input
              type='text'
              defaultValue={orderItem?.name || ""}
              readOnly
              required
              className={`border border-[var(--hoverColor)] w-full rounded p-2 mt-1 outline-0 `}
            />
          </div>
          <div className='w-full mt-2'>
            <label className='capitalize block'>initial Quantity</label>
            <input
              type='number'
              value={orderItem?.pcs || 0}
              required
              readOnly
              className={`border border-[var(--hoverColor)] w-full rounded p-2 mt-1 outline-0 `}
            />
          </div>
          <div className='w-full mt-2'>
            <label className='capitalize block'>return quantity</label>
            <input
              type='number'
              min={0}
              max={orderItem?.pcs || 0}
              value={qty}
              onChange={(e) => {
                setQty(Number(e.target.value))
                setOrderItem({
                  ...orderItem,
                  returned: Number(e.target.value),
                  newQty: orderItem.pcs - Number(e.target.value),
                  subTotal:
                    (orderItem.pcs - Number(e.target.value)) * orderItem.price,
                })
              }}
              required
              className={`border border-[var(--hoverColor)] w-full rounded p-2 mt-1 outline-0 `}
            />
          </div>

          <div className='w-full mt-2'>
            <label className='capitalize block'>new Quantity</label>
            <input
              type='number'
              value={orderItem.newQty || 0}
              required
              readOnly
              className={`border border-[var(--hoverColor)] w-full rounded p-2 mt-1 outline-0 `}
            />
          </div>
          <div className='w-full mt-2'>
            <label className='capitalize block'>sub total</label>
            <input
              type='number'
              value={orderItem.subTotal || 0}
              required
              readOnly
              className={`border border-[var(--hoverColor)] w-full rounded p-2 mt-1 outline-0 `}
            />
          </div>
          <div className='w-full mt-2'>
            <label className='capitalize block'>return Type</label>
            <select
              className='border border-[var(--hoverColor)] w-full rounded p-2 mt-1 outline-0'
              value={orderItem.returnType || "cash"}
              onChange={(e) =>
                setOrderItem({ ...orderItem, returnType: e.target.value })
              }
            >
              <option value='cash'>cash</option>
              <option value='bank'>bank</option>
            </select>
          </div>

          <button
            type='submit'
            className='w-full p-2 bg-[var(--primary)] hover:bg-[var(--hoverColor)] text-white mt-5 rounded'
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
        <button
          className='absolute top-[-20px] right-[-15px] p-1 bg-white rounded-full'
          onClick={() => setShowReturnItemModal(false)}
        >
          <FaTimes />
        </button>
      </div>
    </main>
  )
}

export default ReturnItemModal
