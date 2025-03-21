import { useEffect, useState } from "react"
import { CustomerType } from "../utils/types"
import SingleCustomer from "../components/SingleCustomer"
import { useFilteredCustomers, useResetPointsUsage } from "../queries/customers"
import Loading from "../components/Loading"
import CreateCustomerModal from "../components/modals/CreateCustomerModal"
import { useDashboardContext } from "./DashboardLayout"
import CustomerSearchModal from "../components/modals/CustomerSearchModal"
import { isAxiosError } from "axios"
import { toast } from "react-toastify"
import Pagination from "../components/Pagination"

function AllCustomers() {
  const { showCreateCustomerModal, setShowCreateCustomerModal, currentUser } =
    useDashboardContext()
  const [customerId, setCustomerId] = useState("all")
  const [showCustomerSearchModal, setShowCustomerSearchModal] = useState(false)
  const [debtors, setDebtors] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(50)

  const { data, isLoading, isError } = useFilteredCustomers(
    customerId,
    debtors,
    page,
    limit
  )

  const {
    mutate,
    isPending,
    isSuccess,
    isError: resetError,
    error,
  } = useResetPointsUsage()

  const resetPoints = () => {
    if (currentUser.role === "admin") {
      mutate()
    } else {
      toast.error("not authorized to perform this task")
    }
  }

  // responses
  const responses = () => {
    if (resetError) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
    if (isSuccess) {
      toast.success("points reset is successful")
      location.reload()
    }
  }

  useEffect(() => {
    responses()
  }, [isSuccess, resetError])

  if (isError) return <h1>There was an error...</h1>

  return (
    <main>
      <div className='flex justify-between items-center'>
        <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5 font-bold'>
          Customers
        </h1>
        <button
          className='font-semibold text-xs md:text-base text-[var(--primary)]'
          onClick={resetPoints}
        >
          {isPending ? "Resetting..." : "Reset Points"}
        </button>
      </div>
      <section className='pb-5'>
        <div className='flex justify-end items-center space-x-2 text-red-500 font-semibold'>
          <label className='text-xs md:text-sm lg:text-base'>
            Show Debtors
          </label>
          <input
            type='checkbox'
            checked={debtors}
            onChange={() => {
              setDebtors(!debtors)
              setCustomerId("all")
            }}
          />
        </div>
        <div className='flex justify-between mt-5'>
          <h1 className='text-xs md:text-sm lg:text-base'>
            You have {(data && data?.count) || 0}{" "}
            {debtors
              ? `Debtor${data?.count !== 1 ? "s" : ""}`
              : `Customer${data?.count !== 1 ? "s" : ""}`}
          </h1>
          <button
            className='py-1 px-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--hoverColor)] text-xs md:text-base'
            onClick={() => setShowCreateCustomerModal(true)}
          >
            New Customer
          </button>
        </div>
        {/* SEARCH CUSTOMER */}
        <input
          className='w-full rounded-[25px] border-2 border-[var(--primary)] p-1 md:p-2 mt-2'
          type='text'
          placeholder='search customer'
          onClick={() => {
            setShowCustomerSearchModal(true)
            setDebtors(false)
            setCustomerId("all")
            setPage(1)
          }}
        />
        {/* HEADER */}
        {data && data?.count < 1 ? (
          <h1 className='text-center font-bold'>No customers found</h1>
        ) : (
          <>
            <div className='mt-2 grid grid-cols-9 sticky top-0 border border-white border-b-slate-600 border-t-slate-600 p-1 md:p-2 font-bold bg-white '>
              <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-1 md:p-2 text-left'>
                First Name
              </h2>
              <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base text-left p-1 md:p-2'>
                Last Name
              </h2>
              <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base text-left p-1 md:p-2'>
                Phone Number
              </h2>
              <h2 className='text-[8px] md:text-xs lg:text-base text-left p-1 md:p-2'>
                Points
              </h2>
              <h2 className='text-[8px] md:text-xs lg:text-base text-left p-1 md:p-2'>
                Usage
              </h2>
            </div>
            {/* PRODUCTS */}

            {isLoading ? (
              <Loading />
            ) : (
              <div>
                {data &&
                  data?.customers.map((customer: CustomerType) => {
                    return <SingleCustomer key={customer._id} {...customer} />
                  })}
              </div>
            )}
          </>
        )}
      </section>
      {showCreateCustomerModal && <CreateCustomerModal />}
      {showCustomerSearchModal && (
        <CustomerSearchModal
          showModal={setShowCustomerSearchModal}
          setCustomerId={setCustomerId}
        />
      )}

      {/* PAGINATION */}
      {data && data?.numOfPages > 1 && (
        <Pagination page={page} data={data} setPage={setPage} />
      )}
    </main>
  )
}

export default AllCustomers
