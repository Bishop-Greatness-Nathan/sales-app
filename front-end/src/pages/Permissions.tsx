import { UserTypes } from "../utils/types"
import SingleUser from "../components/SingleUser"
import Loading from "../components/Loading"
import { useUsers } from "../queries/users"

function Permissions() {
  const { data: users, isLoading, isError, error } = useUsers()

  if (isLoading) return <Loading />

  if (isError) return <h1>{error.message}</h1>

  return (
    <div>
      <h1 className='md:text-2xl lg:text-4xl mb-5 mt-5 font-bold'>
        User Permissions
      </h1>
      <div className='grid grid-cols-5 border font-bold sticky top-[80px] md:top-[100px] z-10 bg-white'>
        <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-2 text-left'>
          Name
        </h2>
        <h2 className='text-[8px] md:text-xs border-l lg:text-base p-2 text-center'>
          Username
        </h2>
        <h2 className='text-[8px] md:text-xs border-l lg:text-base p-2 text-center'>
          Role
        </h2>

        <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
          Grant Access
        </h2>
      </div>

      <div>
        {users?.map((user: UserTypes) => {
          return <SingleUser key={user._id} {...user} />
        })}
      </div>
    </div>
  )
}

export default Permissions
