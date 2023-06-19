import {NextResponse} from 'next/server'

export async function GET(
  request: Request,
  {params}: {params: {currency: string}},
) {
  const response = await fetch(
    `http://localhost:21000/api/price/${params.currency}`,
  )
  const {price} = await response.json()
  return NextResponse.json({price})
}
