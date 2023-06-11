import {bamotf} from '@/utils/bamotf'
import {deriveAddress} from '@/utils/derive'
import {kv} from '@vercel/kv'
import {redirect} from 'next/navigation'

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

function Button(props: ButtonProps) {
  return (
    <button
      type="submit"
      className="inline-flex h-10 py-2 px-4 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-gray-800 text-gray-100 hover:bg-gray-800/90"
      {...props}
    />
  )
}

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
  let address = deriveAddress(xpub, index)
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
      <form action={donate} className="flex space-x-2 justify-center flex-wrap">
        <Button value="5" name="donate">
          $5
        </Button>
        <Button value="10" name="donate">
          $10
        </Button>
        <Button value="50" name="donate">
          $50
        </Button>
      </form>

      <div className="w-full p-3">or</div>

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
        <Button>Donate</Button>
      </form>
    </div>
  )
}
