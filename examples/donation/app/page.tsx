import {bamotf} from '@/utils/bamotf'
import {address as addressBase} from '@bam-otf/utils'
import {kv} from '@vercel/kv'
import {redirect} from 'next/navigation'

import {deriveAddress} from '../../../packages/bam-otf-utils/src/derive'
import {Submit} from './submit'

async function donate(formData: FormData) {
  'use server'

  // Validate donation amount
  const donate = formData.get('donate')
  if (!donate) return

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  let xpub = process.env.XPUB_DONATION || ''
  if (!xpub) {
    throw new Error('XPUB_DONATION is not set')
  }

  let index = await kv.incr(`donations-index`)
  let address = addressBase.derive(xpub, index)
  let amount = Number.parseFloat(donate.toString())

  const pi = await bamotf.paymentIntents.create({
    amount,
    address,
    currency: 'USD',
  })

  return redirect(`/${pi.id}`)
}

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">
        How much would you like to donate?
      </h1>
      <PredefinedDonationForm />

      <div className="w-full p-3">or</div>
      <CustomDonationForm />
    </div>
  )
}

function CustomDonationForm() {
  return (
    <form
      action={donate}
      className="flex space-x-2 items-center justify-center"
    >
      <input
        name="donate"
        type="number"
        className="ml-1 rounded-md w-28 placeholder:text-gray-700 text-gray-100 border-gray-500 border appearance-none bg-transparent py-1.5 px-2"
        placeholder="69420"
      />
      <Submit>Donate</Submit>
    </form>
  )
}

function PredefinedDonationForm() {
  return (
    <form action={donate} className="flex space-x-2 justify-center flex-wrap">
      <Submit value="5" name="donate">
        $5
      </Submit>
      <Submit value="10" name="donate">
        $10
      </Submit>
      <Submit value="50" name="donate">
        $50
      </Submit>
    </form>
  )
}
