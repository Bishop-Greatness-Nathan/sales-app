import { FaTimes } from "react-icons/fa"
import { useCreateOrderContext } from "../pages/CreateOrder"

function EditOrderPrice() {
  const { closeEditOrderPrice, submitEditPriceForm } = useCreateOrderContext()
  return (
    <div className='absolute top-0 left-0 flex justify-center items-center h-full w-full blured-bg'>
      <div className='bg-white w-[50%] rounded-md p-5 relative'>
        <p className='mb-2 text-slate-600'>Enter new price for this product</p>
        <form onSubmit={submitEditPriceForm} className='w-full'>
          <input
            type='number'
            name='price'
            required
            className='block p-1 rounded border border-blue-500 w-full mb-1'
          />
          <button className='bg-blue-500 w-full rounded p-2 text-white hover:bg-blue-700 ease-in-out duration-300'>
            Change price
          </button>
        </form>
        <button
          className='absolute top-1 right-1 bg-red-700 text-white rounded'
          onClick={closeEditOrderPrice}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  )
}

export default EditOrderPrice
