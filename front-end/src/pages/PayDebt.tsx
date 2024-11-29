import { useState, FormEvent, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useGetSingleOrder, useUpdateOrder } from "../queries/orders"
import Loading from "../components/Loading"

function PayDebt() {
  const [inputs, setInputs] = useState({
    previousDebt: 0,
    amountPaid: 0,
    currentDebt: 0,
    paymentType: "bank",
  })
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetSingleOrder(id as string)

  const {
    mutate,
    isPending,
    isError: isPaymentError,
    isSuccess,
    error: paymentError,
  } = useUpdateOrder()

  // HANDLE SUBMIT
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({
      id,
      balance: inputs.currentDebt,
      amountPaid: inputs.amountPaid,
      paymentType: inputs.paymentType,
    })
  }

  // responses
  useEffect(() => {
    if (isSuccess) {
      toast.success("payment added")
      navigate("/dashboard/customers")
    } else if (isPaymentError) {
      if (isAxiosError(paymentError))
        toast.error(paymentError?.response?.data?.msg)
    }
  }, [isError, isSuccess])

  // set inputs
  useEffect(() => {
    if (order)
      setInputs({
        ...inputs,
        previousDebt: order.balance,
        currentDebt: order.balance,
      })
  }, [order])

  if (isLoading) return <Loading />

  if (isError) return <h1>{error.message}</h1>

  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-semibold uppercase'>
        {order.customer.firstName + " " + order.customer.lastName + "'s" + " "}{" "}
        DEBT PAYMENT
      </h1>
      <section className='bg-white px-2 py-5 rounded-md'>
        <form onSubmit={handleSubmit} className='grid gap-2'>
          <div className='w-full mt-3'>
            <label className='capitalize block font-semibold'>
              previous debt
            </label>
            <p
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            >
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(inputs.previousDebt as number)}
            </p>
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block font-semibold'>
              Amount paid
            </label>
            <input
              type='text'
              name='amount paid'
              required
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  amountPaid: Number(e.target.value),
                  currentDebt:
                    (inputs.previousDebt as number) - Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block font-semibold'>
              payment type
            </label>
            <select
              name='transactionType'
              className='border border-blue-200 w-full rounded p-2 mt-1 outline-0'
              onChange={(e) =>
                setInputs({ ...inputs, paymentType: e.target.value })
              }
            >
              <option value='bank'>bank</option>
              <option value='cash'>cash</option>
            </select>
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block font-semibold'>
              current debt
            </label>
            <p
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            >
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(inputs.currentDebt as number)}
            </p>
          </div>

          <button
            type='submit'
            disabled={isPending}
            className={`bg-[var(--primary)] p-2 rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end
             ${isPending && "cursor-wait"}
            `}
          >
            Pay Debt
          </button>
        </form>
      </section>
    </main>
  )
}

export default PayDebt
