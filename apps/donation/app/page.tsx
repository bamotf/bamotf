import React from 'react'
import {bamotf} from '@/utils/bamotf'
import {env} from '@/utils/env'
import {kv} from '@vercel/kv'
import {redirect} from 'next/navigation'

import {Submit} from './submit'

async function donate(formData: FormData) {
  'use server'

  // Validate donation amount
  const donate = formData.get('donate')
  if (!donate) return

  let index = await kv.incr(`donations-index`)
  let address = bamotf.address.derive(env.XPUB_DONATION, index)
  let amount = Number(donate.toString()) * 100

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
