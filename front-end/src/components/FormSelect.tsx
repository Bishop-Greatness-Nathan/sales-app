import { ChangeEvent } from "react"

type FormSelectType = {
  name?: string
  defaultValue?: string
  list?: string[] | number[]
  labelText?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  extraStyle?: string
}

const FormSelect = ({
  name,
  defaultValue = "",
  list,
  labelText,
  value,
  required,
  extraStyle,
  onChange,
}: FormSelectType) => {
  return (
    <div className='w-full mt-2'>
      <label htmlFor={name} className='capitalize block'>
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        required={required}
        className={`border border-blue-200 w-full rounded p-[9px] mt-1 outline-0 ${extraStyle}`}
      >
        {list?.map((itemValue) => {
          return (
            <option key={itemValue} value={itemValue}>
              {itemValue}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default FormSelect
