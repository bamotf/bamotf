import React from 'react'

const features = [
  {
    name: 'Asynchronous payments',
    description:
      'No more background services to monitor transactions - get instant notifications via webhook once payments are confirmed on the blockchain',
  },
]

export default function FeatureB() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-orange-400">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Don&apos;t worry about how Bitcoin operates
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            bamotf handles the communication with the of Bitcoin network. You
            focus on your business logic.
          </p>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map(feature => (
            <div key={feature.name}>
              <dt className="font-bold">{feature.name}</dt>
              <dd className="mt-1">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
