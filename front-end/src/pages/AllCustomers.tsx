import { useState } from "react"
import { CustomerType } from "../utils/types"
import SingleCustomer from "../components/SingleCustomer"
import { useFilteredCustomers } from "../queries/customers"
import Loading from "../components/Loading"
import CreateCustomerModal from "../components/modals/CreateCustomerModal"
import { useDashboardContext } from "./DashboardLayout"
import CustomerSearchModal from "../components/modals/CustomerSearchModal"

function AllCustomers() {
  const { showCreateCustomerModal, setShowCreateCustomerModal } =
    useDashboardContext()
  const [customerId, setCustomerId] = useState("all")
  const [showCustomerSearchModal, setShowCustomerSearchModal] = useState(false)
  const [debtors, setDebtors] = useState(false)
  const { data, isLoading, isError } = useFilteredCustomers(customerId, debtors)

  console.log(data)
  if (isError) return <h1>There was an error...</h1>

  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5 font-bold'>Customers</h1>
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
            You have {(data && data?.length) || 0}{" "}
            {debtors
              ? `Debtor${data?.length !== 1 ? "s" : ""}`
              : `Customer${data?.length !== 1 ? "s" : ""}`}
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
          }}
        />
        {/* HEADER */}
        {data && data?.length < 1 ? (
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
                  data?.map((customer: CustomerType) => {
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
    </main>
  )
}

export default AllCustomers
