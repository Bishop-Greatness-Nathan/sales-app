import { useEffect, useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import SearchCashForm from "../components/SearchCashForm"
import { TransactionType } from "../utils/types"
import dayjs from "dayjs"
import Loading from "../components/Loading"
import { useDashboardContext } from "./DashboardLayout"
import SingleCashRecord from "../components/SingleCashRecord"
import { useBankRecords } from "../queries/bank"

function Bank() {
  const { currentUser } = useDashboardContext()
  const [date, setDate] = useState(
    dayjs(new Date(Date.now())).format("DD-MM-YYYY")
  )
  const [queryDate, setQueryDate] = useState({
    from: dayjs(new Date(Date.now())).format("YYYY-MM-DD"),
    to: dayjs(new Date(Date.now())).format("YYYY-MM-DD"),
  })
  const [totalBank, setTotalBank] = useState(0)

  const { data, isLoading, isError, error } = useBankRecords(
    queryDate.from,
    queryDate.to
  )

  // GET BANK
  const bankTotal = async () => {
    const totals = data?.bank.reduce(
      (total: { add: number; release: number }, bank: TransactionType) => {
        if (bank.action === "add") total.add += bank.amount
        if (bank.action === "release") total.release += bank.amount
        return total
      },
      { add: 0, release: 0 }
    )

    const bankBalance = totals.add - totals.release
    setTotalBank(bankBalance)
  }

  // FILTER BANK
  const searchBank = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const from = new FormData(e.currentTarget).get("from")
    const to = new FormData(e.currentTarget).get("to")

    if (from === null || to === null) {
      console.error("Date range is not specified")
      return
    }
    const newFrom = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(from as string))
    const newTo = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(to as string))

    setDate(`${newFrom} - ${newTo}`)
    setQueryDate({ ...queryDate, from: from as string, to: to as string })
  }

  useEffect(() => {
    if (data) bankTotal()
  }, [data])

  if (isError) return <h1>{error.message}</h1>

  return (
    <main className='w-full p-1 md:p-5 lg:p-10'>
      <div className='text-sm lg:text-3xl mb-5 font-bold flex justify-between'>
        <h1>Bank Records</h1>
        <h1 className={`${currentUser.role !== "admin" && "hidden"}`}>
          Balance:{" "}
          {Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format((data && data.balance) || 0)}
        </h1>
      </div>

      <SearchCashForm searchCash={searchBank} />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='flex justify-between items-center text-[8px] md:xs lg:text-base bg-[var(--bgColor)] p-1 rounded shadow-sm'>
            <h2>
              Showing{" "}
              <span className='text-blue-800 font-semibold'>
                {data?.bank.length} Result{data?.bank.length > 1 && "s"}
              </span>{" "}
              for <span className='text-blue-800 font-semibold'> {date}</span>
            </h2>

            <Link
              to='/dashboard/record-bank'
              className='bg-[var(--primary)] text-white rounded py-1 px-2 hover:bg-[var(--hoverColor)] ease-in-out duration-300'
            >
              New Record
            </Link>
          </div>
          <h2 className='text-right font-semibold mt-2 text-[var(--textSecondary)] md:text-2xl'>
            {Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(totalBank)}
          </h2>

          {data?.bank.length < 1 ? (
            <h1 className='mt-5'>No record found</h1>
          ) : (
            <div className='mt-3 lg:mt-10'>
              <section className='mt-10'>
                {data?.bank.map((bank: TransactionType) => {
                  return <SingleCashRecord key={bank._id} {...bank} />
                })}
              </section>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Bank
