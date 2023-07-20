import React from 'react'
import Link from 'next/link'

import Card from '../bullet-point/card'
import LandingBackground from '../landing-background/background'
import BamotfLogo from '../logo/bamotf-logo'

function LandingPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-between w-full h-full">
        <div className="wrapper">
          <LandingBackground />
          <div className="landingContainer pb-8">
            <BamotfLogo />
            <h1 className="heading max-w-lg md:max-w-xl lg:max-w-4xl">
              The Bitcoin toolkit for developers
            </h1>
            <p className="description max-w-lg md:max-w-xl lg:max-w-4xl">
              A streamlined, efficient, and open source way to integrate Bitcoin
              as payment method.
            </p>
          </div>

          <div className="flex flex-col w-2/4 gap-3 md:!flex-row">
            <button className="w-full min-w-[120px] h-12 text-base font-medium no-underline dark:text-black text-white border-transparent bg-black dark:bg-white rounded md:leading-6 transition-all duration-300">
              <Link href="/docs">Get started</Link>
            </button>
            <button className="w-full min-w-[120px] h-12 text-base font-medium no-underline border dark:border-neutral-400  dark:text-neutral-200 dark:hover:border-white dark:hover:text-white border-[#EAEAEA] text-neutral-800 hover:border-black hover:text-black rounded md:leading-6 transition-all duration-300">
              <Link href="https://github.com/bamotf/bamotf">Github</Link>
            </button>
          </div>
        </div>

        <section className="flex flex-col items-center w-full h-[80%] lg:h-screen mt-8 mb-8">
          <div className="gap-6 text-center flex flex-col h-full items-center justify-center">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl">
              Why bamotf?
            </h1>
            <p className="opacity-50 w-2/3 text-wrap-balance">
              bamoft integrates the whole infrastructure needed for getting
              started receiving payments, including a server, components and
              packages.
            </p>
          </div>

          <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card
              title="Easy integration with bitcoin network"
              subtitle="Understanding how the bitcoin network operates is painful enough, bamotf streamlines the complexity and makes it more digestible."
            />

            <Card
              title="Autocomplete and type-safe"
              subtitle="The best code is the code that writes itself, so you can move quickly and be sure you don't break stuff accidentally."
            />

            <Card
              title="Dev environment"
              subtitle="Built with a strongly typed programming language, so it doesn't require a PhD to learn or xxxxxx."
            />

            <Card
              title="Ready-to-use components"
              subtitle="Pre-built components and utilities that speed up development and make it the perfect starting point for your next project."
            />

            <Card
              title="Bitcoin for dev couldn't be easier"
              subtitle="bamotf automates your build, test, and deployment into the 3 Bitcoin network."
            />

            <Card
              title="Stay in Sync With Your Transactions"
              subtitle="Streamline your payment integration with the Bitcoin network by utilizing our webhooks. Stay informed about the status of your payment updates."
            />

            <Card
              title="Easy integration with bitcoin network"
              subtitle="Understanding how the bitcoin network operates is painful enough, bamotf streamlines the complexity and makes it more digestible."
            />

            <Card
              title="Easy integration with bitcoin network"
              subtitle="Understanding how the bitcoin network operates is painful enough, bamotf streamlines the complexity and makes it more digestible."
            />

            <Card
              title="Easy integration with bitcoin network"
              subtitle="Understanding how the bitcoin network operates is painful enough, bamotf streamlines the complexity and makes it more digestible."
            />
          </div>
        </section>
      </main>
    </>
  )
}

export default LandingPage
