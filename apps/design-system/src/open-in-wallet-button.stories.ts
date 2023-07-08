import {OpenInWalletButton} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/OpenInWalletButton',
  component: OpenInWalletButton,
  args: {
    redirectUrl: '#',
  },
  parameters: {
    backgrounds: {
      values: [
        {name: 'white', value: '#fff'},
        {name: 'black', value: '#000'},
        {name: 'grey', value: '#ccc'},
      ],
    },
  },
} satisfies Meta<typeof OpenInWalletButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
