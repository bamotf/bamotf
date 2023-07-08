import {QRCode} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/QRCode',
  component: QRCode,
  args: {
    address: 'uahusiahisuahs',
    amount: 1000,
    label: 'Eu amo bitcoin',
    message: 'Pagamento de boleto',
    redirectUrl: 'https://www.google.com',
  },
} satisfies Meta<typeof QRCode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}