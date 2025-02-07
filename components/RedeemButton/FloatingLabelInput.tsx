import { useState } from 'react'
import { cn } from '../../lib/utils'
import { FloatingLabelInputProps } from './types'

export function FloatingLabelInput({
  id,
  name,
  value,
  onChange,
  label,
  type = "text",
  required = false,
  disabled = false,
  readOnly = false,
  language = 'en',
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "block w-full h-12 px-3 pt-6 pb-2 text-sm border border-gray-300 rounded-lg transition-all duration-200 bg-white peer",
          "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
          "placeholder-transparent",
        )}
        placeholder={label}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-2 text-xs transition-all duration-200 pointer-events-none text-gray-500 pt-1",
          isFocused || value ? "translate-y-2 text-[10px]" : "top-1/2 -translate-y-1/2",
        )}
      >
        {label} {required && "*"}
      </label>
    </div>
  )
}
