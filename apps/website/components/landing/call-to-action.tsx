import React from 'react'
import Link from 'next/link'

export default function CallToAction() {
  return (
    <div className="mx-auto w-full max-w-[90rem] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)] py-24 sm:py-32 lg:flex lg:items-center lg:justify-between">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to dive in?
        <br />
        Start receiving today.
      </h2>
      <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
        <Link
          href="docs"
          className="rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Get started
        </Link>
      </div>
    </div>
  )
}
