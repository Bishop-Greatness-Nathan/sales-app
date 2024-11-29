import {
  FormEvent,
  useContext,
  createContext,
  useState,
  useEffect,
} from "react"
import OrderProductModal from "../components/modals/OrderProductModal"
import { toast } from "react-toastify"
import axios from "axios"
import { useDashboardContext } from "./DashboardLayout"
import { OrderItemsType, CustomerType } from "../utils/types"
import OrderItems from "../components/OrderItems"
import EditOrderPrice from "../components/EditOrderPrice"
import TransactionDetails from "../components/TransactionDetails"
import CreateCustomerModal from "../components/modals/CreateCustomerModal"
import SearchCustomerModal from "../components/modals/SearchCustomerModal"
import { useCustomers } from "../queries/customers"
import { useCreateOrder } from "../queries/orders"

type ValueTypes = {
  total: number
  cash: number
  bank: number
  transaction: string
  balance: number
  setCash: React.Dispatch<React.SetStateAction<number>>
  setBank: React.Dispatch<React.SetStateAction<number>>
  orderItems: OrderItemsType[]
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItemsType[]>>
  increment: (id: string) => void
  decrement: (id: string) => void
  deleteItem: (id: string) => void
  openEditOrderPrice: (id: string) => void
  closeEditOrderPrice: () => void
  submitEditPriceForm: (e: FormEvent<HTMLFormElement>) => void
  setCustomer: React.Dispatch<React.SetStateAction<CustomerType>>
  customers: CustomerType[]
  customer: CustomerType
  setTransaction: React.Dispatch<React.SetStateAction<string>>
  showProductModal: boolean
  setShowProductModal: React.Dispatch<React.SetStateAction<boolean>>
  setShowSearchCustomerModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateOrderContext = createContext<ValueTypes | undefined>(undefined)

function getLocalStorage() {
  let orderItems: OrderItemsType[]
  if (localStorage.getItem("orderItems") === null) {
    orderItems = []
  } else {
    orderItems = JSON.parse(localStorage.getItem("orderItems") as string)
  }
  return orderItems
}

function CreateOrder() {
  const { showCreateCustomerModal, createEndOfDay } = useDashboardContext()
  const [orderItems, setOrderItems] = useState<OrderItemsType[]>(
    getLocalStorage()
  )
  const [showEditPrice, setShowEditPrice] = useState(false)
  const [editID, setEditID] = useState("")
  const [total, setTotal] = useState(0)
  const [transaction, setTransaction] = useState("cash")
  const [cash, setCash] = useState(0)
  const [bank, setBank] = useState(0)
  const [balance, setBalance] = useState(0)
  const [customer, setCustomer] = useState<CustomerType>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
    _id: "",
  })

  const [showProductModal, setShowProductModal] = useState(false)
  const [showSearchCustomerModal, setShowSearchCustomerModal] = useState(false)

  const { data: customers } = useCustomers()

  const { mutate, isPending, isError, error, isSuccess } = useCreateOrder()

  // INCREASE QUANTITY
  const increment = (id: string) => {
    const products = orderItems.map((item: OrderItemsType) => {
      // for items sold in half
      if (item.productId === id && item.name === "polyplus") {
        item.pcs += 0.5
        item.subTotal = item.pcs * item.price
      }
      if (item.productId === id && item.name !== "polyplus") {
        item.pcs += 1
        item.subTotal = item.pcs * item.price
      }
      return item
    })
    setOrderItems(products)
  }

  // DECREASE QUANTITY
  const decrement = (id: string) => {
    const products = orderItems.map((item: OrderItemsType) => {
      // for items sold in half
      if (
        item.productId === id &&
        item.name === "polyplus" &&
        item.pcs !== 0.5
      ) {
        item.pcs -= 0.5
        item.subTotal = item.pcs * item.price
      }

      // for items sold in whole
      if (item.productId === id && item.name !== "polyplus" && item.pcs !== 1) {
        item.pcs -= 1
        item.subTotal = item.pcs * item.price
      }
      return item
    })
    setOrderItems(products)
  }

  // DELETE ORDER ITEM
  const deleteItem = (id: string) => {
    const products = orderItems.filter(
      (item: OrderItemsType) => item.productId !== id
    )
    setOrderItems(products)
  }

  const openEditOrderPrice = (id: string) => {
    setEditID(id)
    setShowEditPrice(true)
  }

  const closeEditOrderPrice = () => {
    setShowEditPrice(false)
  }

  // SUBMIT EDIT PRICE FORM
  const submitEditPriceForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const price = Number(new FormData(e.currentTarget).get("price"))

    const products = orderItems.map((item: OrderItemsType) => {
      if (item.productId === editID) {
        item.price = price
        item.subTotal = item.pcs * item.price
      }
      return item
    })
    setOrderItems(products)
    setEditID("")
    setShowEditPrice(false)
  }

  //  Get Total
  const getTotal = () => {
    const orderTotal = orderItems.reduce(
      (total: number, item: OrderItemsType) => {
        total += item.subTotal
        return total
      },
      0
    )
    setTotal(orderTotal)

    // calculate the diff for items
    orderItems.forEach((item) => {
      item.diff = item.subTotal - item.cost * item.pcs
    })
  }

  // clear cart
  const clearCart = () => {
    setOrderItems([])
    localStorage.removeItem("orderItem")
  }

  // calculate balance
  const getBalance = () => {
    if (transaction === "cash") {
      setBalance(0)
    } else {
      setBalance(total - (cash + bank))
    }
  }

  // SUBMIT ORDER
  const submitOrder = async () => {
    if (transaction === "cash" && cash + bank !== total) {
      toast.error("Invalid calculation")
      return
    }

    if (transaction === "credit" && cash + bank >= total) {
      toast.error("Invalid calculation")
      return
    }

    if (transaction === "credit" && customer.firstName === "") {
      toast.error("please enter customer for credit transaction")
      return
    }

    const data = { items: orderItems, total, cash, bank, balance, customer }
    mutate(data)
  }

  // responses
  useEffect(() => {
    if (isSuccess) {
      toast.success("Order created")
      setOrderItems([])
      localStorage.removeItem("orderItems")
      location.reload()
    } else if (isError) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
      }
    }
  }, [isError, isSuccess])

  useEffect(() => {
    getTotal()
  }, [orderItems])

  useEffect(() => {
    getBalance()
  }, [transaction, cash, bank, total])

  useEffect(() => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems))
  }, [orderItems])

  useEffect(() => {
    createEndOfDay()
  }, [])

  const values = {
    orderItems,
    setOrderItems,
    increment,
    decrement,
    deleteItem,
    openEditOrderPrice,
    closeEditOrderPrice,
    submitEditPriceForm,
    total,
    cash,
    bank,
    transaction,
    balance,
    setCash,
    setBank,
    setCustomer,
    customers,
    customer,
    setTransaction,
    showProductModal,
    setShowProductModal,
    setShowSearchCustomerModal,
  }
  return (
    <CreateOrderContext.Provider value={values}>
      <main className='py-5'>
        <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
          Create New Order
        </h1>

        {/* SEARCH PRODUCT */}
        <input
          type='text'
          name='product'
          className='w-full rounded-[25px] border-2 border-[var(--primary)] outline-none p-1 md:p-2 text-xs md:text-base'
          autoFocus
          placeholder='Select order product'
          onClick={() => setShowProductModal(true)}
          readOnly
        />

        {/* MODALS */}
        {showProductModal && <OrderProductModal />}
        {showCreateCustomerModal && <CreateCustomerModal />}
        {showSearchCustomerModal && <SearchCustomerModal />}

        {/* TABLE HEAD */}
        <div className='grid grid-cols-5 mt-10 text-left border border-b-slate-600 p-3 font-bold bg-white'>
          <h2 className='col-span-2 text-[8px] md:text-sm lg:text-base'>
            Item
          </h2>
          <h2 className='text-[8px] md:text-sm lg:text-base'>Price</h2>
          <h2 className='text-[8px] md:text-sm lg:text-base'>Quantity</h2>
          <h2 className='text-[8px] md:text-sm lg:text-base'>Subtotal</h2>
        </div>

        {/* TABLE BODY */}
        <div className='border border-[whitesmoke]'>
          {orderItems.map((item) => (
            <OrderItems key={item.productId} {...item} />
          ))}
        </div>

        {/* TABLE FOOTER */}
        <div
          className={`${
            orderItems.length < 1 && "hidden"
          } grid grid-cols-3 gap-2 mt-5 border border-[whitesmoke] border-t-slate-600 pt-5`}
        >
          <TransactionDetails />
        </div>

        {/* CLEAR CART & SUBMIT BTNS */}
        <div
          className={`${
            orderItems.length < 1 && "hidden"
          } flex justify-between mt-3 `}
        >
          {/* clear cart btn */}
          <button
            className='bg-red-600 rounded px-5 text-white hover:bg-red-800 ease-in-out duration-300 text-xs md:text-base'
            onClick={clearCart}
          >
            Clear Cart
          </button>

          {/* Submit btn */}
          <button
            className={`bg-green-700 py-2 px-5 rounded text-white hover:bg-green-900 ease-in-out duration-300 text-xs md:text-base ${
              isPending && "cursor-wait"
            }`}
            onClick={submitOrder}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Confirm Order"}
          </button>
        </div>
        {showEditPrice && <EditOrderPrice />}
      </main>
    </CreateOrderContext.Provider>
  )
}

export const useCreateOrderContext = () => {
  const context = useContext(CreateOrderContext)
  if (context === undefined)
    throw new Error(
      "useCreateOrderContext must be used within Create Order Context Provider"
    )
  return context
}

export default CreateOrder
