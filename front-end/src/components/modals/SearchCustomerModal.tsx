import { useState, ChangeEvent } from "react"
import { FaTimes } from "react-icons/fa"
import { useCreateOrderContext } from "../../pages/CreateOrder"
import { CustomerType } from "../../utils/types"

function SearchCustomerModal() {
  const { setShowSearchCustomerModal, customers, setCustomer } =
    useCreateOrderContext()
  const [displayedCustomers, setDisplayedCustomers] =
    useState<CustomerType[]>(customers)

  function selectCustomer(phoneNumber: string) {
    const customer = customers.find(
      (customer) => customer.phoneNumber === phoneNumber
    )
    setCustomer(customer as CustomerType)
    setShowSearchCustomerModal(false)
  }

  function filterList(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    const inputValue = input.toLowerCase()
    const filteredValue = customers.filter((customer) => {
      if (inputValue === "") {
        return customer
      } else if (
        customer.firstName.toLowerCase().includes(inputValue) ||
        customer.lastName.toLowerCase().includes(inputValue) ||
        customer.phoneNumber.includes(inputValue)
      ) {
        return customer
      }
    })
    setDisplayedCustomers(filteredValue)
  }

  return (
    <main className='blured-bg fixed top-0 left-0 flex justify-center items-center w-full h-full z-10'>
      <div className='bg-white p-2 rounded text-[8px] md:text-xs lg:text-base w-[80%] md:w-[40%] h-[70%] relative'>
        <input
          type='text'
          autoFocus
          className='w-full mb-2 p-2 rounded outline-none border-2 border-[var(--primary)]'
          onChange={filterList}
          placeholder='search customer name'
        />

        {displayedCustomers.length < 1 ? (
          <h2>Customer not found</h2>
        ) : (
          <div className='h-[90%] overflow-auto'>
            {displayedCustomers.map((customer) => {
              return (
                <p
                  key={customer._id}
                  className='hover:bg-blue-50 mb-1 leader p-1 cursor-pointer uppercase'
                  onClick={() => selectCustomer(customer.phoneNumber)}
                >
                  <span>{customer.firstName}</span>{" "}
                  <span>{customer.lastName}</span>{" "}
                  <span className='text-[var(--primary)]'>
                    {" [ "}
                    {customer.phoneNumber}
                    {" ]"}
                  </span>
                </p>
              )
            })}
          </div>
        )}
        <button
          className='absolute top-[-20px] right-[-20px] bg-white p-1 rounded-full'
          onClick={() => setShowSearchCustomerModal(false)}
        >
          <FaTimes />
        </button>
      </div>
    </main>
  )
}

export default SearchCustomerModal
