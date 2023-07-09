import {QRCode} from '@bam-otf/react'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'React/QRCode',
  component: QRCode,
  args: {
    address: 'bc1q2hk7c9ekf2fj2w5mcdnryyrqtylc9f9cjwhee2',
    amount: 0.00001,
    label: 'sbddesign',
    message: 'For lunch Tuesday',
    redirectUrl: 'https://app.com/success',
  },
  parameters: {
    backgrounds: {
      values: [
        {name: 'white', value: '#fff'},
        {name: 'black', value: '#000'},
        {name: 'grey', value: '#ccc'},
      ],
    },
  },
} satisfies Meta<typeof QRCode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
