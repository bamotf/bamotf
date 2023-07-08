import {OpenInWalletButton} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/OpenInWalletButton',
  component: OpenInWalletButton,
  args: {
    redirectUrl: '#',
  },
} satisfies Meta<typeof OpenInWalletButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
