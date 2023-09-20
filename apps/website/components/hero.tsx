import React from 'react'
import {links} from '@/config/links'
import Link from 'next/link'

import {Logo} from './logo'

export function Hero() {
  return (
    <div className="font-sans w-auto pb-16 pt-[48px] md:pb-24 lg:pb-32 md:pt-16 lg:pt-20 flex justify-between gap-8 items-center flex-col relative z-0">
      <div className="z-50 flex flex-col items-center justify-center gap-5 px-6 text-center lg:gap-6">
        <Logo className="w-[160px] md:w-[200px]" />
        <h1
          className={`bg-gradient-to-b from-black to-[#555] dark:from-white dark:to-[#aaa] gradients-hero text-wrap-balance font-extrabold tracking-[-0.04em] leading-none text-[40px] md:text-5xl lg:text-[80px] max-w-lg md:max-w-xl lg:max-w-4xl text-center text-transparent`}
        >
          The Bitcoin toolkit for developers
        </h1>
        <p className="font-space-grotesk leading-snug dark:text-[#FFFFFFB2] text-[#000000a0] text-[20px] lg:text-xl max-w-md md:max-w-xl lg:max-w-[640px] text-center">
          A streamlined, efficient, and open source way to integrate Bitcoin as
          payment method.
        </p>
      </div>
      <div className="z-50 flex flex-col items-center w-full max-w-md gap-5 px-6">
        <div className="flex flex-col w-full gap-3 md:!flex-row">
          <div className="relative w-full group">
            <button className="w-full min-w-[120px] text-base font-medium no-underline dark:text-black text-white border-transparent bg-black dark:bg-white rounded md:leading-6 transition-all duration-300 ">
              <Link className="block py-3" href="/docs">
                Get Started
              </Link>
            </button>
            <div className="absolute bg-red-100 w-full h-full top-0 -z-10 rounded-full transition-all duration-300 blur-xl group-hover:opacity-70 opacity-0 gradients_translatingGlow__wxytK" />
          </div>
          <div className="relative w-full group">
            <button className="w-full min-w-[120px] text-base font-medium no-underline border dark:border-neutral-400  dark:text-neutral-200 dark:hover:border-white dark:hover:text-white border-[#EAEAEA] text-neutral-800 hover:border-black hover:text-black rounded md:leading-6 transition-all duration-300 ">
              <a
                target="_blank"
                rel="noreferrer"
                href={links.github}
                className="block py-3"
              >
                GitHub
              </a>
            </button>
          </div>
        </div>
        <p className="text-sm text-[#666666]">License: AGPLv3</p>
      </div>
    </div>
  )
}
