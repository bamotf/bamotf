import * as React from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useSearchParams} from '@remix-run/react'
import {useForm} from 'react-hook-form'

import {Icons} from '~/components/icons'
import {buttonVariants} from '~/components/ui/button'
import {Input} from '~/components/ui/input'
import {Label} from '~/components/ui/label'
import {toast} from '~/components/ui/use-toast'
import {cn} from '~/utils/css'
import {z} from '~/utils/zod'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const userAuthSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
})

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    // const signInResult = await signIn('email', {
    //   email: data.email.toLowerCase(),
    //   redirect: false,
    //   callbackUrl: searchParams?.get('from') || '/dashboard',
    // })

    setIsLoading(false)

    // if (!signInResult?.ok) {
    //   return toast({
    //     title: 'Something went wrong.',
    //     description: 'Your sign in request failed. Please try again.',
    //     variant: 'destructive',
    //   })
    // }

    return toast({
      title: 'Check your email',
      description: 'We sent you a login link. Be sure to check your spam too.',
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </button>
        </div>
      </form>
    </div>
  )
}
