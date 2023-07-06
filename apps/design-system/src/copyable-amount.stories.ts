import {CopyableAmount} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/CopyableAmount',
  component: CopyableAmount,
  args: {
    amount: 1000,
  },
} satisfies Meta<typeof CopyableAmount>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
