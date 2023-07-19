import React from 'react'
import Link from 'next/link'

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

          <div className="flex flex-col w-2/6 gap-3 md:!flex-row">
            <button className="w-full min-w-[120px] h-12 text-base font-medium no-underline dark:text-black text-white border-transparent bg-black dark:bg-white rounded md:leading-6 transition-all duration-300">
              <Link href="/docs">Get started</Link>
            </button>
            <button className="w-full min-w-[120px] h-12 text-base font-medium no-underline border dark:border-neutral-400  dark:text-neutral-200 dark:hover:border-white dark:hover:text-white border-[#EAEAEA] text-neutral-800 hover:border-black hover:text-black rounded md:leading-6 transition-all duration-300">
              <Link href="https://github.com/bamotf/bamotf">Github</Link>
            </button>
          </div>
        </div>

        <section className="flex flex-col items-center justify-between w-1/2 h-screen text-center">
          <div>
            <h1>Why bamotf?</h1>
            <p>
              bamoft integrates the whole infrastructure needed for getting
              started receiving payments, including a server, components and
              packages.
            </p>
          </div>

          {/* <div>
            <h2>1. Easy integration with bitcoin network</h2>
            <p>Understanding how bitcoin network operates is painful enough, bamotf streamline the complexity and made it more digestible.</p>
          </div>

          <div>
            <h2>2. Autocomplete and type-safe</h2>
            <p>The best code is the code that writes itself, so you can move quickly and be sure you don't break stuff accidentally.</p>
          </div>

          <div>
            <h2>3. Dev environment</h2>
            <p>Built with a strong typed programming language, so it doesn't require PhD to learn or xxxxxx.</p>
          </div>

          <div>
            <h2>4. xxxxx</h2>
            <p>Pre-built components and utilities that speed up development and makes it the perfect starting point for your next project.</p>
          </div>

          <div>
            <h2>5. Bitcoin for dev couldn’t be easier - or faster</h2>
            <p>bamotf automates your build, test, and deployment into the 3 Bitcoin network.</p>
          </div> */}
        </section>
      </main>
    </>
  )
}

export default LandingPage
