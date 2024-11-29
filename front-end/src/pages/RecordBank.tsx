import { FormEvent, useEffect } from "react"
import FormRow from "../components/FormRow"
import { isAxiosError } from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useCreateBankRecord } from "../queries/bank"

function RecordBank() {
  const { mutate, isPending, isError, isSuccess, error } = useCreateBankRecord()
  const navigate = useNavigate()

  // handle submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate(data)
  }

  // responses
  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) toast.error(error?.response?.data?.msg)
    } else if (isSuccess) {
      toast.success("New bank record created")
      navigate("/dashboard/bank")
    }
  }, [isError, isSuccess])

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        New Bank Record
      </h1>
      <section className='bg-white px-2 py-5 rounded-md shadow'>
        <form onSubmit={handleSubmit}>
          <FormRow
            type='number'
            labelText='amount'
            name='amount'
            min={0}
            required
          />
          <div className='mt-2 text-xs md:text-sm lg:text-base'>
            <label htmlFor='remark' className='block'>
              Action
            </label>
            <select
              name='action'
              className='border  w-full rounded p-2 mt-1 outline-0'
            >
              <option value='add'>add</option>
              <option value='release'>release</option>
              <option value='to cash'>to cash</option>
            </select>
          </div>
          <div className='mt-2 text-xs md:text-sm lg:text-base'>
            <label htmlFor='remark' className='block'>
              Remark
            </label>
            <textarea
              name='remark'
              id='remark'
              cols={30}
              rows={5}
              className='border w-full rounded p-2 mt-1 outline-0'
            ></textarea>
          </div>

          <button
            type='submit'
            disabled={isPending}
            className={`text-xs md:text-sm lg:text-base bg-[var(--primary)] p-3 rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end ${
              isPending && "cursor-wait"
            }`}
          >
            Enter Record
          </button>
        </form>
      </section>
    </main>
  )
}

export default RecordBank
