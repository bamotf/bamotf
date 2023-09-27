import React from 'react'

import CallToAction from './call-to-action'
import FeatureA from './feature-a'
import FeatureB from './feature-b'
import {Hero} from './hero'

export function LandingPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-between w-full">
        <div className="overflow-hidden w-full">
          <Hero />
        </div>

        <FeatureA />

        <CallToAction />
      </main>
    </>
  )
}
