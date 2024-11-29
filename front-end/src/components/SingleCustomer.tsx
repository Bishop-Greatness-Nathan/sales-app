import { CustomerType } from "../utils/types"
import { Link } from "react-router-dom"
import { CiEdit } from "react-icons/ci"

function SingleCustomer({
  _id,
  firstName,
  lastName,
  phoneNumber,
  debt,
}: CustomerType) {
  return (
    <div
      className={`grid grid-cols-7 ${
        debt && debt > 0 ? "bg-red-100" : "bg-white"
      } mt-2 rounded shadow text-[8px] md:text-base p-1 md:p-2 capitalize`}
    >
      <p className='col-span-2 p-1 md:p-2 '>{firstName}</p>
      <p className='col-span-2 p-1 md:p-2'>{lastName}</p>
      <p className='col-span-2 p-1 md:p-2 '>{phoneNumber}</p>
      <div className='p-1 md:p-2 text-[8px] md:text-base text-blue-500 hover:text-blue-800 relative'>
        <Link to={`../customer-activity/${_id}`}>
          {debt && debt > 0 ? "view debt" : "activity"}
        </Link>
        <Link className='absolute top-0 right-0' to={`../customers/${_id}`}>
          <CiEdit />
        </Link>
      </div>
    </div>
  )
}

export default SingleCustomer
