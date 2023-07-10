import React, {useEffect, useState} from 'react'
import {Check, Copy} from 'lucide-react'

export interface CopyableProps {
  /** Text that will prefix the copyable text */
  prefix?: string
  /** Text that will be copied when User click on the copy button */
  text: string
  /** Callback function when User click on copy button */
  onCopied?: () => void
}

/**
 * Component that allows the user to copy a text to the clipboard
 *
 * @param {CopyableProps} props
 * @returns
 */
export function Copyable({prefix, text, onCopied}: CopyableProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) {
        setCopied(false)
        onCopied?.()
      }
    }, 3000)

    return () => {
      clearTimeout(timeout)
    }
  }, [copied, onCopied])

  return (
    <div className="copyable">
      {prefix ? <span className="copyable-prefix">{prefix}</span> : null}
      <span className="copyable-input">{text}</span>
      <button onClick={handleCopy} className="copyable-button">
        <span
          className={`${
            copied ? 'show' : ''
          } copyable-icon-container copyable-success`}
        >
          <Check className="copyable-icon" aria-label="Copied" />
        </span>
        <span className={`${!copied ? 'show' : ''} copyable-icon-container`}>
          <Copy className="copyable-icon" aria-label="Copy" />
        </span>
      </button>
    </div>
  )
}
