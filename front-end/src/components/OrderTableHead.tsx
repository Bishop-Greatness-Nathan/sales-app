function OrderTableHead() {
  return (
    <div
      className={`grid grid-cols-10 gap-2 text-left border border-b-slate-600 font-bold bg-white text-[8px] md:text-base sticky top-0`}
    >
      <h2 className='col-span-3 p-2'>Item</h2>
      <h2 className='p-2'>Qty</h2>
      <h2 className='col-span-2 p-2'>Price</h2>
      <h2 className='col-span-2 p-2'>Subtotal</h2>
      <h2 className=' col-span-2 p-2'>Returned</h2>
    </div>
  )
}

export default OrderTableHead
