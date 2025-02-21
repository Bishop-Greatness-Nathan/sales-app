import { FormEvent } from "react"
import FormRow from "./FormRow"
import { OrderType } from "../utils/types"

function SearchHistoryForm({
  searchHistory,
  selectedProduct,
  setShowProductModal,
  setQueryDate,
  queryDate,
  setOrders,
}: {
  searchHistory: (e: FormEvent<HTMLFormElement>) => void
  selectedProduct: string
  setShowProductModal: React.Dispatch<React.SetStateAction<boolean>>
  setQueryDate: React.Dispatch<
    React.SetStateAction<{ from: string; to: string }>
  >
  queryDate: { from: string; to: string }
  setOrders: React.Dispatch<React.SetStateAction<OrderType[]>>
}) {
  return (
    <div>
      <form
        onSubmit={searchHistory}
        className='grid md:grid-cols-2 lg:grid-cold-3 gap-4 text-[8px] md:text-base'
      >
        <div className='mt-2'>
          <label className='block text-xs md:text-base'>Select Product</label>
          <input
            type='text'
            name='product'
            className='w-full p-[9px] mt-1 text-[8px] md:text-sm lg:text-base border outline-none rounded'
            autoFocus
            placeholder='search product'
            value={selectedProduct}
            onClick={() => setShowProductModal(true)}
            readOnly
          />
        </div>
        <FormRow
          type='date'
          name='from'
          labelText='from'
          onChange={(e) => {
            setQueryDate({ ...queryDate, from: e.target.value })
            setOrders([])
          }}
          required
          extraStyle='text-[8px] md:text-sm lg:text-base p-1'
        />
        <FormRow
          type='date'
          name='to'
          labelText='to'
          onChange={(e) => {
            setQueryDate({ ...queryDate, to: e.target.value })
            setOrders([])
          }}
          required
          extraStyle='text-[8px] md:text-sm lg:text-base p-1'
        />
        <button
          className={`bg-[var(--primary)] self-end p-[10px] rounded text-white hover:bg-[var(--hoverColor)]  ease-in-out duration-300 `}
        >
          Search Order
        </button>
      </form>
    </div>
  )
}

export default SearchHistoryForm
