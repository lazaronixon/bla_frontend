'use client'

import { useActionState } from 'react'
import { signUp, type SignUpState } from '@/app/actions/auth'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoaderCircleIcon, TriangleAlertIcon } from 'lucide-react'

export function SignUpForm() {
  const [state, action, pending] = useActionState<SignUpState, FormData>(
    signUp,
    undefined
  )

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {state?.error && (
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Sign up to start borrowing books from the library.
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
                autoComplete="new-password"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                autoComplete="new-password"
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
            {pending ? 'Creating account…' : 'Create account'}
          </Button>
          <p className="flex justify-center gap-1 text-sm text-muted-foreground">
            <span>Already have an account?</span>
            <a href="/sign-in" className="text-foreground underline underline-offset-4 hover:text-primary">
              Sign in
            </a>
          </p>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
