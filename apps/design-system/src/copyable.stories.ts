import {Copyable} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/Copyable',
  component: Copyable,
  args: {
    text: 'x6t6sxt6xstysjksmkf0',
  },
} satisfies Meta<typeof Copyable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
