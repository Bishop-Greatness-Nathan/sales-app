import PageLink from "./PageLinks"
import { FaSitemap, FaShoppingBasket, FaWarehouse } from "react-icons/fa"
import { MdSettings, MdOutlineCreateNewFolder, MdHistory } from "react-icons/md"
import { HiOutlineCash } from "react-icons/hi"
import { CgProfile } from "react-icons/cg"
import { CiShoppingCart, CiViewList } from "react-icons/ci"
import { AiOutlineBank } from "react-icons/ai"
import { GiExpense } from "react-icons/gi"
import { IoIosPeople } from "react-icons/io"
import { TbLockCheck } from "react-icons/tb"

import Logo from "./Logo"
import { useDashboardContext } from "../pages/DashboardLayout"
import { LiaBusinessTimeSolid } from "react-icons/lia"

const BigSidebar = () => {
  const { currentUser } = useDashboardContext()

  return (
    // wrapper
    <div className='hidden lg:block h-[100dvh] lg:col-span-1 pb-11 overflow-hidden bg-white'>
      {/* container */}
      <div className='h-[94vh] overflow-hidden pt-[10px] bg-white'>
        {/* logo */}
        <div>
          <Logo container='w-[50%] m-auto mb-[30px]' image='w-full' />
        </div>
        {/* links */}
        <div className='h-[80%] overflow-auto'>
          <PageLink
            url='create-order'
            text='Create Order'
            icon={<CiShoppingCart />}
          />
          <PageLink url='orders' text='Orders' icon={<FaShoppingBasket />} />
          <PageLink
            url='create-product'
            text='Create Product'
            icon={<MdOutlineCreateNewFolder />}
          />
          <PageLink url='products' text='All Products' icon={<FaSitemap />} />
          <PageLink url={`store`} text='Warehouse' icon={<FaWarehouse />} />
          <PageLink url='expenses' text='Expenses' icon={<GiExpense />} />
          <PageLink url='history' text='History' icon={<MdHistory />} />
          <PageLink url='cash' text='Cash Record' icon={<HiOutlineCash />} />
          <PageLink url='bank' text='Bank Record' icon={<AiOutlineBank />} />
          <PageLink url='customers' text='Customers' icon={<IoIosPeople />} />
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
          <PageLink url={`settings`} text='Settings' icon={<MdSettings />} />
        </div>
      </div>
    </div>
  )
}

export default BigSidebar
