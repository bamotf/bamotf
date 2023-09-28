import React from 'react'
import {useRouter} from 'next/router'
import type {DocsThemeConfig} from 'nextra-theme-docs'

import {Footer} from './components/footer'
import {Logo} from './components/logo'
import {links} from './config/links'

const config: DocsThemeConfig = {
  logo: <Logo className="h-8 w-24" />,
  head: (
    <>
      {/* Favicon */}
      <link
        rel="apple-touch-icon-precomposed"
        sizes="57x57"
        href="apple-touch-icon-57x57.png"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="114x114"
        href="apple-touch-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="72x72"
        href="apple-touch-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="144x144"
        href="apple-touch-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="60x60"
        href="apple-touch-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="120x120"
        href="apple-touch-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="76x76"
        href="apple-touch-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="152x152"
        href="apple-touch-icon-152x152.png"
      />
      <link
        rel="icon"
        type="image/png"
        href="favicon-196x196.png"
        sizes="196x196"
      />
      <link
        rel="icon"
        type="image/png"
        href="favicon-96x96.png"
        sizes="96x96"
      />
      <link
        rel="icon"
        type="image/png"
        href="favicon-32x32.png"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="favicon-16x16.png"
        sizes="16x16"
      />
      <link
        rel="icon"
        type="image/png"
        href="favicon-128.png"
        sizes="128x128"
      />
      <meta
        name="description"
        content="Open-Source Bitcoin payment processor for developers. Secure, private, and easy to set up."
      />
      <meta
        name="keywords"
        content="Bitcoin, Payments, bamotf, Open-source, Developers, Security, Privacy"
      />
      <meta name="author" content="bamotf" />
      <meta name="application-name" content="&nbsp;" />
      <meta name="msapplication-TileColor" content="#161616" />
      <meta name="msapplication-TileImage" content="mstile-144x144.png" />
      <meta name="msapplication-square70x70logo" content="mstile-70x70.png" />
      <meta
        name="msapplication-square150x150logo"
        content="mstile-150x150.png"
      />
      <meta name="msapplication-wide310x150logo" content="mstile-310x150.png" />
      <meta
        name="msapplication-square310x310logo"
        content="mstile-310x310.png"
      />
      <meta
        property="og:title"
        content="bamotf - Your Gateway to Seamless Bitcoin Payments"
      />
      <meta
        property="og:description"
        content="Elevate your app with bamotf - the first open-source Bitcoin payment processor crafted for developers. Ensure security, embrace privacy, and accelerate your project with our near zero-config solution."
      />
      <meta property="og:image" content="https://bamotf.com/og.png" />
      <meta property="og:url" content="https://bamotf.com" />
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://bamotf.com" />
      <meta
        property="twitter:title"
        content="bamotf - Your Gateway to Seamless Bitcoin Payments"
      />
      <meta
        property="twitter:description"
        content="Elevate your app with bamotf - the first open-source Bitcoin payment processor crafted for developers. Ensure security, embrace privacy, and accelerate your project with our near zero-config solution."
      />
      <meta property="twitter:image" content="https://bamotf.com/og.png" />
    </>
  ),
  project: {
    link: links.github,
  },
  chat: {
    link: links.discord,
  },
  navbar: {
    extraContent: (
      <a
        href={links.x}
        target="_blank"
        rel="noreferrer"
        className="nx-p-2 nx-text-current"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 1668.56 1221.19"
          fill="currentColor"
        >
          <title>Twitter / X</title>
          <g transform="translate(52.39 -25.059)">
            <path d="M283.94 167.31l386.39 516.64L281.5 1104h87.51l340.42-367.76L984.48 1104h297.8L874.15 558.3l361.92-390.99h-87.51l-313.51 338.7-253.31-338.7h-297.8zm128.69 64.46h136.81l604.13 807.76h-136.81L412.63 231.77z"></path>
          </g>
        </svg>
      </a>
    ),
  },
  docsRepositoryBase: `${links.github}/tree/main/apps/docs`,
  footer: {
    text: <Footer />,
  },
  useNextSeoProps() {
    const {asPath} = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – bamotf',
      }
    }
  },
  primaryHue: 27,
  primarySaturation: 96,
}

export default config
