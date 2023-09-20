import React from 'react'
import {bamotf} from '@/utils/bamotf'
import {env} from '@/utils/env'
import {kv} from '@vercel/kv'
import {redirect} from 'next/navigation'

async function donate(formData: FormData) {
  'use server'

  // Validate donation amount
  const donate = formData.get('donate')
  if (!donate) return

  let index = await kv.incr(`donations-index`)
  let address = bamotf.address.derive(
    env.XPUB,
    index,
    env.VERCEL_ENV === 'preview' ? 'test' : env.VERCEL_ENV,
  )
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
    <div>
      <h1>How much would you like to donate?</h1>
      <PredefinedDonationForm />
      <hr />
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
      Custom amount:
      <input name="donate" type="number" placeholder="69420" />
      <button type="submit">Donate</button>
    </form>
  )
}

function PredefinedDonationForm() {
  return (
    <form action={donate}>
      <button type="submit" value="5" name="donate">
        $5
      </button>
      <button type="submit" value="10" name="donate">
        $10
      </button>
      <button type="submit" value="50" name="donate">
        $50
      </button>
    </form>
  )
}
