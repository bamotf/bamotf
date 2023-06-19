'use client'

import {experimental_useFormStatus as useFormStatus} from 'react-dom'

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export function Submit(props: ButtonProps) {
  const {pending} = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex h-10 py-2 px-4 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-gray-800 text-gray-100 hover:bg-gray-800/90"
      {...props}
    />
  )
}
