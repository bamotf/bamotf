import {Copyable} from '@bamotf/react/src/copyable'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'Components / Copyable',
  component: Copyable,
  tags: ['autodocs'],
  args: {
    text: 'bc1q2hk7c9ekf2fj2w5mcdnryyrqtylc9f9cjwhee2',
  },
} satisfies Meta<typeof Copyable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
