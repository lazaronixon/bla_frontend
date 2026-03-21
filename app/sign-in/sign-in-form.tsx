'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { signIn, type SignInState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { LoaderCircleIcon } from 'lucide-react'

export function SignInForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signIn,
    undefined
  )

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access the library.
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && (
              <LoaderCircleIcon
                data-icon="inline-start"
                className="animate-spin"
              />
            )}
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
