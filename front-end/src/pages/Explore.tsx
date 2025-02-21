import { Link } from "react-router-dom"
import { exploreImages } from "../utils/defaults"
import { FaHome } from "react-icons/fa"

function Explore() {
  return (
    <main className='p-3 md:p-5 lg:p-10'>
      <div className='flex justify-between mb-5'>
        <h1 className='md:text-2xl lg:text-4xl font-semibold'>Explore Page</h1>
        <Link
          to='/'
          className='font-semibold text-[var(--primary)] align-bottom md:hidden'
        >
          <FaHome />
        </Link>
        <Link
          to='/'
          className='font-semibold text-[var(--primary)] align-bottom hidden md:block'
        >
          Home Page
        </Link>
      </div>
      <div className='grid md:grid-cols-2 gap-5'>
        {exploreImages.map((image, index) => {
          return (
            <div
              key={index}
              className='bg-[var(--primary)] text-center rounded-md shadow-md overflow-hidden p-3'
            >
              <img src={image.url} alt='' className='rounded-md' />
              <p className='mt-2 text-white font-semibold capitalize'>
                {image.text}
              </p>
            </div>
          )
        })}
      </div>
      <Link
        to='/'
        className='block text-center mt-5 pb-5 font-bold text-[var(--primary)]'
      >
        Back Home
      </Link>
    </main>
  )
}

export default Explore
