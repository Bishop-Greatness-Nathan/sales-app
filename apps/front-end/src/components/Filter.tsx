function Filter({
  filterBtns,
  filterFunction,
}: {
  filterBtns: string[]
  filterFunction: () => void
}) {
  return (
    <div className='flex justify-end items-center space-x-3 mb-3 mt-3 text-xs md:text-base'>
      <span className='font-semibold'>Filter: </span>

      <select
        className='border-none rounded p-1 outline-0'
        defaultValue='All'
        onChange={filterFunction}
      >
        {filterBtns.map((btn, index) => {
          return (
            <option key={index} value={btn}>
              {btn}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default Filter
