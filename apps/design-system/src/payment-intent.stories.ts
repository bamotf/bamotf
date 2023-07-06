import {PaymentIntent} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/PaymentIntent',
  component: PaymentIntent,
  args: {
    intent: {
      address: 'uahusiahisuahs',
      amount: 1231n,
      currency: 'BRL',
    },
    price: 50,
    qrCodeProps: {
      label: 'Eu amo bitcoin',
      message: 'Pagamento de boleto',
      redirectUrl: 'https://www.google.com',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PaymentIntent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
