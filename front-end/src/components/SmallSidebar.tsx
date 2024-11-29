import { useDashboardContext } from "../pages/DashboardLayout"
import PageLink from "./PageLinks"
import {
  FaSitemap,
  FaShoppingBasket,
  FaTimes,
  FaWarehouse,
} from "react-icons/fa"
import { MdSettings, MdOutlineCreateNewFolder, MdHistory } from "react-icons/md"
import { HiOutlineCash } from "react-icons/hi"
import { CgProfile } from "react-icons/cg"
import { CiShoppingCart, CiViewList } from "react-icons/ci"
import { AiOutlineBank } from "react-icons/ai"
import { GiExpense } from "react-icons/gi"
import { IoIosPeople } from "react-icons/io"
import { TbLockCheck } from "react-icons/tb"
import { LiaBusinessTimeSolid } from "react-icons/lia"
import Logo from "./Logo"

const SmallSidebar = () => {
  const { showSidebar, setShowSidebar, currentUser } = useDashboardContext()

  return (
    <>
      {showSidebar && (
        <div className='absolute top-0 left-0 z-20 w-full h-full m-auto flex items-center justify-center small-sidebar lg:hidden small-sidebar'>
          <div className='w-[95%] h-[95%] bg-white rounded relative overflow-auto'>
            <button
              className='absolute top-[20px] left-[20px] text-2xl text-red-600 '
              onClick={() => setShowSidebar(false)}
            >
              <FaTimes />
            </button>
            <div
              className='ml-auto mr-auto w-3/4 mt-[100px] md:w-1/2'
              onClick={() => setShowSidebar(false)}
            >
              <Logo container='w-[30%] m-auto mb-[30px]' image='w-full' />
              <PageLink
                url='create-order'
                text='Create Order'
                icon={<CiShoppingCart />}
              />
              <PageLink
                url='orders'
                text='Orders'
                icon={<FaShoppingBasket />}
              />
              <PageLink
                url='create-product'
                text='Create Product'
                icon={<MdOutlineCreateNewFolder />}
              />
              <PageLink
                url='products'
                text='All Products'
                icon={<FaSitemap />}
              />
              <PageLink url={`store`} text='Warehouse' icon={<FaWarehouse />} />
              <PageLink url='expenses' text='Expenses' icon={<GiExpense />} />
              <PageLink url='history' text='History' icon={<MdHistory />} />
              <PageLink
                url='cash'
                text='Cash Record'
                icon={<HiOutlineCash />}
              />
              <PageLink
                url='bank'
                text='Bank Record'
                icon={<AiOutlineBank />}
              />
              <PageLink
                url='customers'
                text='Customers'
                icon={<IoIosPeople />}
              />
              <PageLink
                url='endofday'
                text='Daily Stock'
                icon={<LiaBusinessTimeSolid />}
              />
              <PageLink
                url='purchase-list'
                text='Purchase List'
                icon={<CiViewList />}
              />
              {currentUser.role === "admin" && (
                <PageLink
                  url='permissions'
                  text='Permissions'
                  icon={<TbLockCheck />}
                />
              )}
              <PageLink url={`profile`} text='Profile' icon={<CgProfile />} />
              <PageLink
                url={`settings`}
                text='Settings'
                icon={<MdSettings />}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SmallSidebar
