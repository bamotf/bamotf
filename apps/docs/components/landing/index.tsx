import React from 'react'
import Link from 'next/link'
import Typed from 'react-typed'

import LandingBackground from '../landing-background/background'

function LandingPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full h-full">
        <div className="wrapper">
          <LandingBackground />
          <div className="landingContainer">
            <h1 className="heading">
              The Bitcoin toolkit <br /> for developers
            </h1>
            <Typed
              className="typed"
              strings={['Fast', 'Simple', 'Easy', 'Secure', 'Powerful']}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
            <p className="description">
              A streamlined, efficient, and open source way to integrate Bitcoin
              as payment method.
            </p>
          </div>
          <p className="button">
            <Link className="button-link" href="/docs">
              Get started
            </Link>
          </p>
          {/* <p className="button">
            <Link className="" href="/https://github.com/bamotf/bamotf">
              Github
            </Link>
          </p> */}
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
