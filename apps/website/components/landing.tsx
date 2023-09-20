import React from 'react'

import Card from './card'
import {Hero} from './hero'

export function LandingPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-between w-full">
        <Hero />
        <section className="flex flex-col items-center w-full lg:h-[968px] mb-48 lg:mb-16">
          <div className="gap-6 text-center flex flex-col h-52 mt-24 items-center justify-center">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl">
              Why bamotf?
            </h1>
            <p className="opacity-50 w-2/3 text-wrap-balance">
              <i className="italic">bamotf</i> integrates the whole
              infrastructure needed for starting receiving bitcoin payments,
              including server, react components, utility packages and webhooks.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card
              title="Don't worry about how Bitcoin operates"
              subtitle="bamotf reduces the complexity of using the bitcoin core into a simple Stripe-like flow."
            />

            <Card
              title="Simple and intuitive API"
              subtitle="Modern REST API for you to manage your payments and webhooks that notifies you when something changes."
            />

            <Card
              title="Localhost development"
              subtitle="Quickly set up a local development environment that matches production."
            />

            <Card
              title="Currency conversion"
              subtitle="Automatically convert prices for your customers in their local currency."
            />

            <Card
              title="Autocomplete and type-safe"
              subtitle="The best code is the code that writes itself, so you can move quickly and be sure you don't break stuff accidentally."
            />

            <Card
              title="React components"
              subtitle="Ready-to-use pre-built components and utilities that speed up development and make it the perfect starting point for your next project."
            />
          </div>
        </section>
      </main>
    </>
  )
}
