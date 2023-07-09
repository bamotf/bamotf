import {QRCode} from '@bam-otf/react/src/qr-code'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'Components / QRCode',
  component: QRCode,
  tags: ['autodocs'],
  args: {
    address: 'uahusiahisuahs',
    amount: 1000,
    label: 'Eu amo bitcoin',
    message: 'Pagamento de boleto',
    redirectUrl: '#',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof QRCode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
