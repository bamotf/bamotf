import React from 'react'
import Link from 'next/link'

import {links} from '../config/links'
import {Logo} from './logo'

const navLinks = [
  {
    title: 'Resources',
    items: [
      //   {name: 'Blog', href: '/blog'},
      {
        name: 'Releases',
        href: `${links.github}/releases`,
      },
    ],
  },
  {
    title: 'Bamotf',
    items: [
      {name: 'Documentation', href: '/docs'},
      {
        name: 'API Reference',
        href: '/docs/reference',
      },
      //   {
      //     name: 'FAQ',
      //     href: '/docs/faq',
      //   },
    ],
  },
  {
    title: 'Company',
    items: [{name: 'Twitter', href: links.x}],
  },
  {
    title: 'Legal',
    items: [
      {name: 'Privacy Policy', href: '/privacy'},
      {name: 'Terms of Service', href: '/terms'},
    ],
  },
  {
    title: 'Support',
    items: [
      {name: 'GitHub', href: links.github},
      {name: 'Discord', href: links.discord},
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <div className="w-full" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="w-full py-8 mx-auto">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-1 gap-8 xl:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 md:gap-8">
              {navLinks.map(({title, items}, i) => (
                <div key={i} className="mt-12 md:!mt-0">
                  <h3 className="text-sm text-black dark:text-white">
                    {title}
                  </h3>
                  <ul className="mt-4 space-y-1.5 list-none ml-0">
                    {items.map(({name, href}) => (
                      <li key={name}>
                        <a
                          href={href}
                          className="text-sm text-[#666666] dark:text-[#888888] no-underline hover:hover:text-gray-700 hover:hover:dark:text-white transition"
                        >
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/*           
          <div className="mt-12 xl:!mt-0">
            <h3 className="text-sm text-black dark:text-white">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-[#888888]">
              Subscribe to the Bamotf newsletter and stay updated on new releases
              and features, guides, and case studies.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="border-[#666666] dark:border-[#888888] w-full min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border rounded-md appearance-none dark:text-white sm:text-sm dark:bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:border-white focus:placeholder-gray-400"
                placeholder="you@example.com"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-black border border-transparent rounded-md dark:bg-white dark:text-black sm:text-sm hover:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-white dark:hover:hover:bg-gray-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div> */}
        </div>

        <div className="pt-8 mt-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <Link className="text-current" title="Bamotf homepage" href="/">
              <Logo className="h-6 w-auto" />
            </Link>

            <p className="mt-4 text-xs text-gray-500 dark:text-[#888888]">
              © {/* */}
              {year}
              {/* */} Bamotf, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
