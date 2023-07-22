import React from 'react'
import type {DocsThemeConfig} from 'nextra-theme-docs'

import {Logo} from './components/logo'
import {links} from './config/links'

const config: DocsThemeConfig = {
  logo: <Logo className="h-8 w-24" />,
  project: {
    link: links.github,
  },
  chat: {
    link: links.discord,
  },
  docsRepositoryBase: links.github,
  footer: {
    text: '© bamotf. 2023',
  },
}

export default config
