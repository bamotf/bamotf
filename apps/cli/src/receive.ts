import {cancel, isCancel, text, note, outro, spinner} from '@clack/prompts'
import {setTimeout as sleep} from 'node:timers/promises'
import chalk from 'chalk'
import {cashier} from './cashier'
import type {PaymentIntent} from '@cashier/cashier'

export type ReceiveOptions = {
  '--': string[]
  amount?: string
  address?: string
}

/**
 * Will expect a payment
 * @param options
 */
export async function receive(options: ReceiveOptions) {
  const amount = await getAmount(options)
  const address = await getAddress(options)

  await note(
    `Please send ${chalk.yellow(
      amount,
    )} to ${address} to complete the payment.`,
    'Payment instructions',
  )

  // Create payment
  const pi = await cashier.paymentIntents.create({
    amount,
    address,
  })

  if (pi.status !== 200) {
    return cancel('Failed to create payment intent')
  }

  const s = spinner()
  s.start('Waiting payment confirmation')

  await waitPaymentConfirmation(pi.body.id)

  s.stop('Payment confirmed')

  outro("You're all set!")
}

/**
 * Query the payment intent until it's confirmed
 * @param id
 * @returns
 */
async function waitPaymentConfirmation(id: string): Promise<PaymentIntent> {
  // FIX: this will break the design
  await sleep(1000)

  const pi = await cashier.paymentIntents.retrieve(id)
  if (pi.status === 200 && pi.body.status === 'confirmed') {
    return Promise.resolve(pi.body)
  }

  return waitPaymentConfirmation(id)
}

/**
 * Get either the amount from the options or prompt the user for it
 * @param options
 * @returns
 */
async function getAmount(options: Pick<ReceiveOptions, 'amount'>) {
  // TODO: Validate here
  if (options.amount) {
    return Number(options.amount)
  }

  const amount = await text({
    message: 'What is the amount?',
    placeholder: '0.01',
    validate: value => {
      // TODO: Validate here
      if (value.length === 0) return `Value is required!`
      try {
        if (Number(value) < 1) throw new Error('Amount is too low')
      } catch (error) {
        return `Invalid amount`
      }
    },
  })

  if (isCancel(amount)) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  return Number(amount)
}

async function getAddress(options: Pick<ReceiveOptions, 'address'>) {
  // TODO: Generate address from xpub
  // get first address from xpub
  // const address = await getAddressFromXpub(ADDRESS_XPUB, 0);

  //   const ADDRESS_XPUB =
  //   "zpub6rS7ey4zDJz9A1ugPeqkNfcYmpAR9Ah3W7E78ZYk6gYM3tELxYXJ3KtV7CzMuiWXJZnReBi2J5uSYh6F4pv6MSn65iWQGhWx2SW57CfvmCL";

  return 'bc1q5aspuk0ew7rlw2t7s6a5qluhxx09ak6gnsatk5'

  //   if (options.address) {
  //     return options.address;
  //   }
  //   const address = await text({
  //     message: "What is the address?",
  //     placeholder: "bc1........................................",
  //     validate: (value) => {
  //       // TODO: Validate here
  //       if (value.length === 0) return `Value is required!`;
  //     },
  //   });
  //   if (isCancel(address)) {
  //     cancel("Operation cancelled");
  //     return process.exit(0);
  //   }
  //   return address;
}
