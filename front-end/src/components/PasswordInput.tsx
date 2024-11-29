import { useState } from "react"

function PasswordInput({
  input,
  container,
  name,
}: {
  input?: string
  container?: string
  name: string
}) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div
      className={`flex justify-center items-center w-full border mb-1 ${container}`}
    >
      <input
        type={showPassword ? "text" : "password"}
        className={`w-[85%] ${input}`}
        required
        name={name}
      />
      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='w-[15%] border-none outline-none flex justify-center items-center'
      >
        {showPassword ? "hide" : "show"}
      </button>
    </div>
  )
}

export default PasswordInput
