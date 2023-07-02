import React from 'react'
import {QRCodeSVG} from 'qrcode.react'

interface QRCodeProps {
  bgColor: string
  fgColor: string
  value: string
}

export function QRCode({bgColor, fgColor, value}: QRCodeProps) {
  return <QRCodeSVG bgColor={bgColor} fgColor={fgColor} value={value} />
}
