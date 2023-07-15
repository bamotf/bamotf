import React from 'react'
import Link from 'next/link'
import Typed from 'react-typed'

import LandingBackground from '../landing-background/background'

function LandingPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full h-full">
        <LandingBackground />
        <div className="wrapper">
          <div className="landingContainer">
            <h1 className="heading">Bam Makes It</h1>
            <Typed
              className="typed"
              strings={['Fast', 'Simple', 'Easy', 'Secure', 'Powerful']}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
            <p className="description">
              Designed specifically for web developers, the best way to create
              payment intents.
            </p>
          </div>
          <p className="button">
            <Link className="button-link" href="/docs">
              Get started <span>→</span>
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}

export default LandingPage
