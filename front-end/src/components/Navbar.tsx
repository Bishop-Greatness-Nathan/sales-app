import { FaAlignLeft } from "react-icons/fa"
import Logo from "./Logo"
import Logout from "./Logout"
import { useDashboardContext } from "../pages/DashboardLayout"

const Navbar = () => {
  const { showSidebar, setShowSidebar } = useDashboardContext()
  return (
    <div
      className={`flex justify-between items-center p-3 px-2 lg:px-5 h-[80px] md:h-[100px] bg-[var(--bgColor)] w-full sticky top-0 z-10`}
    >
      <button
        className='text-xl md:text-3xl text-[var(--primary)] hover:text-[var(--hoverColor)] ease-in-out duration-300 lg:opacity-0'
        onClick={() => {
          setShowSidebar(!showSidebar)
        }}
      >
        <FaAlignLeft />
      </button>
      <Logo container='w-[60px] md:w-[100px] block lg:hidden ' image='w-full' />
      <h1 className='hidden lg:block text-3xl'>Dashboard</h1>
      <Logout />
    </div>
  )
}

export default Navbar
