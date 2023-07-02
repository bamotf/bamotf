import React from 'react'

interface DonationInfoProps {
  amount: number
  currency: string
  price: number
  btcAmount: number
}

export function DonationInfo({
  amount,
  currency,
  price,
  btcAmount,
}: DonationInfoProps) {
  return (
    <>
      <div className="">
        Donating: {amount} {currency}
      </div>
      <div className="">BTC PRICE: {price}</div>
      <div className="">Amount to pay: {btcAmount}</div>
    </>
  )
}
