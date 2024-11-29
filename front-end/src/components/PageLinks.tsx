import { NavLink } from "react-router-dom"

const PageLink = ({
  text,
  url,
  icon,
}: {
  text: string
  url: string
  icon: React.ReactNode
}) => {
  return (
    <div className='group hover:bg-[whitesmoke] '>
      <NavLink
        to={url}
        className='flex items-center space-x-2 p-2 mb-1 text-slate-500 pl-10 ease-in-out duration-300 focus:bg-[whitesmoke]'
      >
        <button className='text-xl'>{icon}</button>
        <span> {text}</span>
      </NavLink>
    </div>
  )
}

export default PageLink
