import React from "react"

function Pagination({
  page,
  data,
  setPage,
}: {
  page: number
  data: any
  setPage: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <div className='flex justify-between mt-1 font-semibold text-xs lg:text-base text-[var(--primary)]'>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        prev
      </button>
      <span>
        page {page} of {data && data.numOfPages}
      </span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === data?.numOfPages}
      >
        next
      </button>
    </div>
  )
}

export default Pagination
