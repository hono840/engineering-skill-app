import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2'
  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-blue-500'

  const classes = `${baseClasses} ${errorClasses} ${className}`

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input className={classes} {...props} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
