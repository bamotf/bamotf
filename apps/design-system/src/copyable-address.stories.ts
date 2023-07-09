import {CopyableAddress} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/CopyableAddress',
  component: CopyableAddress,
  args: {
    address: 'bc1q2hk7c9ekf2fj2w5mcdnryyrqtylc9f9cjwhee2',
  },
} satisfies Meta<typeof CopyableAddress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
