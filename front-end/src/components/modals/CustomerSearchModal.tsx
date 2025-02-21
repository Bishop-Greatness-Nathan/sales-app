import { useState, useEffect, ChangeEvent } from "react"
import { FaTimes } from "react-icons/fa"
import { CustomerType } from "../../utils/types"
import { useCustomers } from "../../queries/customers"

function CustomerSearchModal({
  showModal,
  setCustomerId,
}: {
  showModal: React.Dispatch<React.SetStateAction<boolean>>
  setCustomerId: React.Dispatch<React.SetStateAction<string>>
}) {
  const [displayedCustomers, setDisplayedCustomers] = useState<CustomerType[]>(
    []
  )
  const { data: customers, isLoading } = useCustomers()

  // SELECT CUSTOMER
  function selectCustomer(phoneNumber: string) {
    if (phoneNumber) {
      const customer = customers.find(
        (customer: CustomerType) => customer.phoneNumber === phoneNumber
      )
      setCustomerId(customer._id)
    } else {
      setCustomerId("all")
    }
    showModal(false)
  }

  // FILTER LIST
  function filterList(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    const inputValue = input.toLowerCase()
    const filteredValue = customers?.filter((customer: CustomerType) => {
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

  useEffect(() => {
    if (customers)
      setDisplayedCustomers([
        { firstName: "All", lastName: "Customers", phoneNumber: "" },
        ...customers,
      ])
  }, [customers])

  return (
    <main className='blured-bg fixed top-0 left-0 flex justify-center items-center w-full h-full z-20'>
      <div className='w-[80%] md:w-[60%] h-[80%] bg-white rounded-md p-5 relative'>
        <input
          type='text'
          autoFocus
          className='w-full mb-2 p-2 rounded outline-none border-2 border-[var(--primary)]'
          onChange={filterList}
          placeholder='search name or phone number'
        />

        {isLoading ? (
          <h1 className='text-center font-semibold'>Loading...</h1>
        ) : (
          <div className='h-[90%] overflow-auto'>
            {displayedCustomers?.map((customer: CustomerType) => {
              return (
                <p
                  key={customer.phoneNumber}
                  className='hover:bg-blue-50 mb-1 leader p-1 cursor-pointer uppercase text-xs md:text-base'
                  onClick={() => selectCustomer(customer.phoneNumber)}
                >
                  <span>{customer.firstName}</span>{" "}
                  <span>{customer.lastName}</span>{" "}
                  {customer.phoneNumber ? (
                    <span className='text-[var(--primary)]'>
                      {" [ "}
                      {customer.phoneNumber}
                      {" ]"}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              )
            })}
          </div>
        )}

        <button
          className='absolute top-[-20px] right-[-20px] p-1 bg-white rounded-full'
          onClick={() => showModal(false)}
        >
          <FaTimes />
        </button>
      </div>
    </main>
  )
}

export default CustomerSearchModal
// function CustomerSearchModal({
//   showModal,
//   setCustomers,
// }: {
//   showModal: React.Dispatch<React.SetStateAction<boolean>>
//   setCustomers: React.Dispatch<React.SetStateAction<CustomerType[]>>
// }) {
//   const [displayedCustomers, setDisplayedCustomers] = useState<CustomerType[]>(
//     []
//   )
//   const { data: customers, isLoading } = useCustomers()

//   // SELECT CUSTOMER
//   function selectCustomer(phoneNumber: string) {
//     if (phoneNumber) {
//       const customer = customers.filter(
//         (customer: CustomerType) => customer.phoneNumber === phoneNumber
//       )

//       setCustomers(customer as CustomerType[])
//     } else {
//       setCustomers(customers)
//     }
//     showModal(false)
//   }

//   // FILTER LIST
//   function filterList(e: ChangeEvent<HTMLInputElement>) {
//     const input = e.target.value
//     const inputValue = input.toLowerCase()
//     const filteredValue = customers?.filter((customer: CustomerType) => {
//       if (inputValue === "") {
//         return customer
//       } else if (
//         customer.firstName.toLowerCase().includes(inputValue) ||
//         customer.lastName.toLowerCase().includes(inputValue) ||
//         customer.phoneNumber.includes(inputValue)
//       ) {
//         return customer
//       }
//     })
//     setDisplayedCustomers(filteredValue)
//   }

//   useEffect(() => {
//     if (customers)
//       setDisplayedCustomers([
//         { firstName: "All", lastName: "Customers", phoneNumber: "" },
//         ...customers,
//       ])
//   }, [customers])

//   return (
//     <main className='blured-bg fixed top-0 left-0 flex justify-center items-center w-full h-full z-20'>
//       <div className='w-[80%] md:w-[60%] h-[80%] bg-white rounded-md p-5 relative'>
//         <input
//           type='text'
//           autoFocus
//           className='w-full mb-2 p-2 rounded outline-none border-2 border-[var(--primary)]'
//           onChange={filterList}
//           placeholder='search name or phone number'
//         />

//         {isLoading ? (
//           <h1 className='text-center font-semibold'>Loading...</h1>
//         ) : (
//           <div className='h-[90%] overflow-auto'>
//             {displayedCustomers?.map((customer: CustomerType) => {
//               return (
//                 <p
//                   key={customer._id}
//                   className='hover:bg-blue-50 mb-1 leader p-1 cursor-pointer uppercase text-xs md:text-base'
//                   onClick={() => selectCustomer(customer.phoneNumber)}
//                 >
//                   <span>{customer.firstName}</span>{" "}
//                   <span>{customer.lastName}</span>{" "}
//                   {customer.phoneNumber ? (
//                     <span className='text-[var(--primary)]'>
//                       {" [ "}
//                       {customer.phoneNumber}
//                       {" ]"}
//                     </span>
//                   ) : (
//                     ""
//                   )}
//                 </p>
//               )
//             })}
//           </div>
//         )}

//         <button
//           className='absolute top-[-20px] right-[-20px] p-1 bg-white rounded-full'
//           onClick={() => showModal(false)}
//         >
//           <FaTimes />
//         </button>
//       </div>
//     </main>
//   )
// }

// export default CustomerSearchModal
