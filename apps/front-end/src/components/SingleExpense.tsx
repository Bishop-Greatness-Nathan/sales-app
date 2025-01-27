import { ExpenseType } from "../utils/types"

function SingleExpense({
  amount,
  description,
  enteredAt,
  enteredBy,
  createdAt,
}: ExpenseType) {
  const date = new Date(enteredAt as string)

  return (
    <main className='mt-4'>
      <div className='flex justify-between items-center bg-blue-50 p-1 rounded shadow-sm text-[8px] md:xs lg:text-base font-semibold'>
        <div>
          {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
            date
          )}{" "}
          <span>
            {createdAt
              ? new Date(createdAt as string).toLocaleTimeString()
              : ""}
          </span>
        </div>
        <h3>Entered by: {enteredBy}</h3>
        <h3>
          Amt:{" "}
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(amount)}
        </h3>
      </div>
      <div>
        <p className='bg-white p-1 rounded shadow-sm mt-1 text-[8px] md:xs lg:text-base'>
          {description}
        </p>
      </div>
    </main>
  )
}

export default SingleExpense
