import { Link } from "react-router-dom"
import Logo from "../components/Logo"

function Landing() {
  return (
    <div className='w-[85%] m-auto flex py-5'>
      {/* left part */}
      <div className='w-full lg:w-[50%]'>
        <Logo container='w-[100px] md:w-[150px]' />
        <div>
          <h1 className='text-2xl lg:text-5xl font-bold text-[var(--primary)] mt-10 text'>
            Barthoy Technologies
          </h1>

          <div>
            <h2 className='text-[var(--primary)] font-semibold uppercase'>
              About Us
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              earum atque esse ea minima dolorum hic, voluptatibus numquam aut
              illo!
            </p>
          </div>
          <div>
            <h2 className='text-[var(--primary)] font-semibold uppercase'>
              Our Vision
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              earum atque esse ea minima dolorum hic, voluptatibus numquam aut
              illo!
            </p>
          </div>
          <div>
            <h2 className='text-[var(--primary)] font-semibold uppercase'>
              Our Mission
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              earum atque esse ea minima dolorum hic, voluptatibus numquam aut
              illo!
            </p>
          </div>
          <div className='mt-10'>
            <Link
              to='/register'
              className='bg-[var(--primary)] py-2 px-4 rounded text-white text-lg mr-4 hover:bg-[var(--hoverColor)] ease-in-out duration-300'
            >
              Create Account
            </Link>
            <Link
              to='/login'
              className='bg-[var(--primary)] py-2 px-4 rounded text-white text-lg hover:bg-[var(--hoverColor)] ease-in-out duration-300'
            >
              Login
            </Link>

            <Link
              to='/explore'
              className='block mt-4 w-[180px] text-center bg-[var(--primary)] py-2 px-4 rounded text-white text-lg hover:bg-[var(--hoverColor)] ease-in-out duration-300'
            >
              Explore The App
            </Link>
          </div>
        </div>
      </div>
      {/* right part */}
      <div className='hidden lg:block w-[50%]'>
        <div className='w-[75%] m-auto mt-40 '>
          <img src='/landing_img.svg' alt='' />
        </div>
      </div>
    </div>
  )
}

export default Landing
