import Categories from "../components/Categories"
import ChangePassword from "../components/ChangePassword"

function Settings() {
  return (
    <main className='p-1 md:p-5 lg:p-10'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-semibold'>
        Settings
      </h1>
      <ChangePassword />
      <Categories />
    </main>
  )
}

export default Settings
