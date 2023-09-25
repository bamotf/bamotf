import {PaymentDetails} from '@bamotf/react/src/payment-details'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'Components / PaymentDetails',
  component: PaymentDetails,
  tags: ['autodocs'],
  args: {
    address: 'bc1q2hk7c9ekf2fj2w5mcdnryyrqtylc9f9cjwhee2',
    amount: 0.12345678,
    label: 'sbddesign',
    message: 'For lunch Tuesday',
    redirectUrl: 'https://app.com/success',
  },
} satisfies Meta<typeof PaymentDetails>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
