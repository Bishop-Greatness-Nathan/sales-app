import { SingleProductType } from "../utils/types"
import { Link } from "react-router-dom"
import { CiEdit } from "react-icons/ci"
import { useDashboardContext } from "../pages/DashboardLayout"

function SingleProduct({ _id, name, CP, SP, qty }: SingleProductType) {
  const { currentUser } = useDashboardContext()
  return (
    <div className='grid grid-cols-7 border'>
      <div className='col-span-2 text-[8px] md:text-sm lg:text-base p-2 capitalize relative'>
        {name}
        <div
          className={`${
            currentUser.role !== "admin" && "hidden"
          } absolute top-0 right-0 group`}
        >
          <Link to={`../update-product/${_id}`} className='text-blue-700 '>
            <CiEdit />
          </Link>
          <p className='absolute top-4 right-0 hidden group-hover:block text-[8px] md:text-xs text-green-700'>
            Update
          </p>
        </div>
      </div>
      <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
        {new Intl.NumberFormat().format(CP)}
      </p>
      <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
        {new Intl.NumberFormat().format(SP)}
      </p>
      <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
        {new Intl.NumberFormat().format(qty)}
      </p>
      <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
        {new Intl.NumberFormat().format(qty * CP)}
      </p>
      <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
        {new Intl.NumberFormat().format(qty * SP)}
      </p>
    </div>
  )
}

export default SingleProduct
