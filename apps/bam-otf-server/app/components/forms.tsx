import React, {useId, useRef} from 'react'
import {useInputEvent} from '@conform-to/react'
import {twMerge} from 'tailwind-merge'

import {Button as ButtonBase, type ButtonProps} from '~/components/ui/button'
import {Checkbox} from '~/components/ui/checkbox'
import {Input} from '~/components/ui/input'
import {Label} from '~/components/ui/label'

export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function ErrorList({id, errors}: {errors?: ListOfErrors; id?: string}) {
  const errorsToRender = errors?.filter(Boolean)
  if (!errorsToRender?.length) return null
  return (
    <ul id={id} className="space-y-1">
      {errorsToRender.map(e => (
        <li key={e} className="text-[10px] text-danger">
          {e}
        </li>
      ))}
    </ul>
  )
}

export function Field({
  labelProps,
  inputProps,
  errors,
  className,
}: {
  labelProps: React.ComponentPropsWithoutRef<typeof Label>
  inputProps: React.ComponentPropsWithoutRef<typeof Input>
  errors?: ListOfErrors
  className?: string
}) {
  const fallbackId = useId()
  const id = inputProps.id ?? fallbackId
  const errorId = errors?.length ? `${id}-error` : undefined
  return (
    <div className={twMerge(className)}>
      <Input
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        {...inputProps}
      />
      {/* the label comes after the input so we can use the sibling selector in the CSS to give us animated label control in CSS only */}
      <Label htmlFor={id} {...labelProps} />
      <div className="px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  )
}

export function TextareaField({
  labelProps,
  textareaProps,
  errors,
  className,
}: {
  labelProps: Omit<JSX.IntrinsicElements['label'], 'className'>
  textareaProps: Omit<JSX.IntrinsicElements['textarea'], 'className'>
  errors?: ListOfErrors
  className?: string
}) {
  const fallbackId = useId()
  const id = textareaProps.id ?? textareaProps.name ?? fallbackId
  const errorId = errors?.length ? `${id}-error` : undefined
  return (
    <div className={twMerge(className)}>
      <textarea
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        placeholder=" "
        {...textareaProps}
        className="h-48 w-full rounded-lg border border-night-400 bg-night-700 px-4 pt-8 text-body-xs caret-white outline-none focus:border-brand-primary disabled:bg-night-400"
      />
      {/* the label comes after the input so we can use the sibling selector in the CSS to give us animated label control in CSS only */}
      <label htmlFor={id} {...labelProps} />
      <div className="px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  )
}

export function CheckboxField({
  labelProps,
  buttonProps,
  errors,
}: {
  labelProps: Omit<typeof Label, 'className'>
  buttonProps: Omit<
    React.ComponentPropsWithoutRef<typeof Checkbox>,
    'type' | 'className'
  > & {
    type?: string
  }
  errors?: ListOfErrors
}) {
  const fallbackId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  // To emulate native events that Conform listen to:
  // See https://conform.guide/integrations
  const control = useInputEvent({
    // Retrieve the checkbox element by name instead as Radix does not expose the internal checkbox element
    // See https://github.com/radix-ui/primitives/discussions/874
    ref: () =>
      buttonRef.current?.form?.elements.namedItem(buttonProps.name ?? ''),
    onFocus: () => buttonRef.current?.focus(),
  })
  const id = buttonProps.id ?? buttonProps.name ?? fallbackId
  const errorId = errors?.length ? `${id}-error` : undefined
  return (
    <div>
      <div className="flex gap-2">
        <Checkbox
          id={id}
          ref={buttonRef}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          {...buttonProps}
          onCheckedChange={state => {
            control.change(Boolean(state.valueOf()))
            buttonProps.onCheckedChange?.(state)
          }}
          onFocus={event => {
            control.focus()
            buttonProps.onFocus?.(event)
          }}
          onBlur={event => {
            control.blur()
            buttonProps.onBlur?.(event)
          }}
          type="button"
        />
        <Label htmlFor={id} {...labelProps} />
      </div>
      <div className="px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  )
}

/** Submit button with submitting status */
export function Button({
  status = 'idle',
  type = 'submit',
  ...props
}: ButtonProps & {
  status?: 'pending' | 'success' | 'error' | 'idle'
}) {
  const companion = {
    pending: <span className="inline-block animate-spin">🌀</span>,
    success: <span>✅</span>,
    error: <span>❌</span>,
    idle: null,
  }[status]

  return (
    <ButtonBase type={type} {...props}>
      <div>{props.children}</div>
      {companion}
    </ButtonBase>
  )
}
