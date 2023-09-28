import React from 'react'
import {links} from '@/config/links'
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative xl:static isolate">
      {/* lines */}
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-black/10 [mask-image:radial-gradient(100%_100%_at_top_right,black,transparent)] dark:stroke-white/10 dark:[mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg
          x="50%"
          y={-1}
          className="overflow-visible fill-neutral-200/20 dark:fill-neutral-800/20"
        >
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
        />
      </svg>

      {/* Bg polygons */}
      <div
        className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        aria-hidden="true"
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#42494e] to-[#dcb387] opacity-20"
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-[90rem] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)] pb-24 pt-10 sm:pb-32 lg:flex lg:py-40">
        {/* Left content */}
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="h-11" />
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href={links.github} className="inline-flex space-x-6">
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold leading-6 text-orange-400 ring-1 ring-inset ring-orange-500/20">
                What&apos;s new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300">
                <span>Just shipped v0.1.2</span>
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
            Bitcoin Payments Infrastructure
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
            Bamotf is the first open-source payment processor for Bitcoin made
            for developers offering security, privacy, censorship resistance,
            and a near zero-config solution to accept bitcoins on your
            application.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="docs"
              className="rounded-md bg-orange-500 text-white px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            >
              Get started <span aria-hidden="true">→</span>
            </Link>
            <a href={links.github} className="text-sm font-semibold leading-6">
              GitHub <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        {/* Right content */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              src="/hero.png"
              alt="App screenshot"
              width={1890}
              height={1442}
              className="w-[76rem] dark:hidden ring-1 ring-black/10 rounded-xl"
            />
            <Image
              src="/hero-dark.png"
              alt="App screenshot"
              width={1890}
              height={1442}
              className="w-[76rem] hidden dark:block"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
