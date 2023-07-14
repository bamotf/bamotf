import {QRCode} from '@bamotf/react/src/qr-code'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'Components / QRCode',
  component: QRCode,
  tags: ['autodocs'],
  args: {
    address: 'bc1q2hk7c9ekf2fj2w5mcdnryyrqtylc9f9cjwhee2',
    amount: 0.00001,
    label: 'sbddesign',
    message: 'For lunch Tuesday',
    redirectUrl: 'https://app.com/success',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof QRCode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
