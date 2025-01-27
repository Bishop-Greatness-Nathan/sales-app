import { Link, useRouteError } from "react-router-dom"
import errorImg from "../assets/images/error_img.svg"

function Error() {
  const error = useRouteError()
  console.log(error)
  // Narrowing the type of `error`
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: number }).status

    if (status === 404) {
      return (
        <div className='w-full h-[80dvh] flex items-center justify-center'>
          <div className='w-[300px] md:w-[400px] text-center'>
            <img src={errorImg} alt='error image' />
            <h2 className='text-2xl mt-5 text-slate-500'>Page Not Found</h2>
            <p className='mt-5 text-slate-500'>
              Seems you are looking for the wrong page
            </p>
            <h2 className='text-cyan-700 text-xl'>
              <Link to='/'>Back Home</Link>
            </h2>
          </div>
        </div>
      )
    }
  }

  return (
    <div className='w-full'>
      <h1 className='text-center mt-[50px] text-2xl'>Something went wrong</h1>
    </div>
  )
}

export default Error
