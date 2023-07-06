import {CopyableAddress} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/CopyableAddress',
  component: CopyableAddress,
  args: {
    address: 'uahusiahisuahs',
  },
} satisfies Meta<typeof CopyableAddress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
