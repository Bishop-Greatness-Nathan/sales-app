import { createContext, useContext, useState } from "react"
import { redirect, useLoaderData, useNavigate } from "react-router-dom"
import { Outlet, useNavigation } from "react-router-dom"
import BigSidebar from "../components/BigSidebar"
import SmallSidebar from "../components/SmallSidebar"
import Navbar from "../components/Navbar"
import Loading from "../components/Loading"
import customFetch from "../utils/customFetch"
import { UserTypes } from "../utils/types"
import axios from "axios"
import { toast } from "react-toastify"

type ValueTypes = {
  currentUser: UserTypes
  logout: () => void
  showSidebar: boolean
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  showCreateCustomerModal: boolean
  setShowCreateCustomerModal: React.Dispatch<React.SetStateAction<boolean>>
  showReturnItemModal: boolean
  setShowReturnItemModal: React.Dispatch<React.SetStateAction<boolean>>
  IDs: IdTypes
  setIDs: React.Dispatch<React.SetStateAction<IdTypes>>
  createEndOfDay: () => void
}

export const loader = async () => {
  try {
    const {
      data: { user },
    } = await customFetch.get("/user/current-user")
    return { user }
  } catch (error) {
    return redirect("/")
  }
}

type CombinedTypes = {
  user: UserTypes
}

type IdTypes = {
  orderId: string
  itemId: string
}

const DashboardContext = createContext<ValueTypes | undefined>(undefined)

function DashboardLayout() {
  const { user: currentUser } = useLoaderData() as CombinedTypes
  const [showSidebar, setShowSidebar] = useState(false)
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false)
  const [showReturnItemModal, setShowReturnItemModal] = useState(false)
  const [IDs, setIDs] = useState({ orderId: "", itemId: "" })

  const navigate = useNavigate()

  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  // END OF DAY
  const createEndOfDay = async () => {
    try {
      await customFetch.get("/endofday/new")
    } catch (error) {
      return error
    }
  }

  // LOGOUT
  const logout = async () => {
    try {
      await customFetch.get("/auth/logout")
      toast.success("...logged out")
      navigate("/")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  const values = {
    currentUser,
    logout,
    setShowSidebar,
    showSidebar,
    showCreateCustomerModal,
    setShowCreateCustomerModal,
    showReturnItemModal,
    setShowReturnItemModal,
    IDs,
    setIDs,
    createEndOfDay,
  }
  return (
    <>
      <DashboardContext.Provider value={values}>
        <main className='grid lg:grid-cols-5 h-[100dvh] overflow-hidden'>
          <BigSidebar />
          <div className='lg:col-span-4 overflow-auto'>
            <SmallSidebar />
            <Navbar />
            <div className='p-2 lg:p-10 relative'>
              {isLoading ? <Loading /> : <Outlet />}
            </div>
          </div>
        </main>
      </DashboardContext.Provider>
    </>
  )
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (context === undefined)
    throw new Error(
      "useDashboardContext must be used within Dashboard Context Provider"
    )
  return context
}

export default DashboardLayout
