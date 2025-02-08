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
  numeric = false,
}: FloatingLabelInputProps) {
  // Função de log que só funciona em desenvolvimento
  const debugLog = (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...args)
    }
  }

  debugLog(`📑 Input ${name}:`, {
    value,
    isFocused: false,
    disabled,
    readOnly,
    type
  })

  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    debugLog(`🔍 Focus em ${name}`)
    setIsFocused(true)
  }

  const handleBlur = () => {
    debugLog(`🔎 Blur em ${name}`)
    setIsFocused(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugLog(`✏️ Mudança em ${name}:`, e.target.value)
    onChange(e)
  }

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "block w-full h-12 px-3 text-base border border-gray-300 rounded-lg transition-all duration-200 bg-white peer",
          "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
          "placeholder-transparent",
          isFocused ? "pt-6 pb-2" : "pt-6 pb-3.5",
        )}
        placeholder={label}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete="off"
        data-form-type="other"
        data-lpignore="true"
        spellCheck="false"
        inputMode={numeric ? "numeric" : "text"}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none",
          isFocused || value
            ? "text-[10px] top-2"
            : "text-base top-1/2 -translate-y-1/2",
          isFocused && "text-black"
        )}
      >
        {label} {required && "*"}
      </label>
    </div>
  )
}
