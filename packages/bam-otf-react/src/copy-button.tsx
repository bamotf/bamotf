import React, {useState} from 'react'

interface CopyButtonProps {
  text: string
  onCopied: () => void
}

export function CopyButton({text, onCopied}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      onCopied()
    }, 5000)
  }

  return (
    <span onClick={handleCopy} className="cursor-pointer">
      {copied ? 'Copied! ✅' : 'Copy'}
    </span>
  )
}
