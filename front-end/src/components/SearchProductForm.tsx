import { FormEvent, SetStateAction } from "react"

function SearchProductForm({
  setShowProductModal,
  selectedProduct,
  handleSubmit,
}: {
  setShowProductModal: React.Dispatch<SetStateAction<boolean>>
  selectedProduct: string
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form
      className='flex justify-center items-center w-full rounded-[25px] overflow-hidden border-2 bg-[var(--primary)] border-[var(--primary)] mt-2'
      onSubmit={handleSubmit}
    >
      <input
        type='text'
        name='product'
        className='w-[80%] p-1 md:p-2 border-none outline-none text-xs md:text-base'
        autoFocus
        placeholder='search product'
        value={selectedProduct}
        onClick={() => setShowProductModal(true)}
        readOnly
      />

      <button
        type='submit'
        className='w-[20%] border-none outline-none text-xs md:text-base bg-[var(--primary)] text-white cursor-pointer  hover:bg-[var(--hoverColor)]p-1 md:p-2'
      >
        Submit
      </button>
    </form>
  )
}

export default SearchProductForm
