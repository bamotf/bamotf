import React from 'react'
import Image from 'next/image'
import type {DocsThemeConfig} from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <Image src="bamotf-logo.svg" alt={'bamotf Logo'} width={100} height={30} />
  ),
  project: {
    link: 'https://github.com/shuding/nextra-docs-template',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: 'Made in João Pessoa, Brazil',
  },
}

export default config
