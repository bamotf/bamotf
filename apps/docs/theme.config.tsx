import React from 'react'
import type {DocsThemeConfig} from 'nextra-theme-docs'

import BamotfLogo from './components/logo/bamotf-logo'

const config: DocsThemeConfig = {
  logo: <BamotfLogo />,
  project: {
    link: 'https://github.com/bamotf/bamotf',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/bamotf/bamotf',
  footer: {
    text: 'Made in João Pessoa, Brazil',
  },
}

export default config
0
