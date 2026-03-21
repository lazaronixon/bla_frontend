'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'

export type SignInState = { error?: string } | undefined
export type SignUpState = { error?: string } | undefined

export async function signIn(
  _state: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const response = await fetch('http://localhost:3000/sign_in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email_address: email, password }),
  })

  if (!response.ok) {
    return { error: 'Invalid email or password.' }
  }

  const token = response.headers.get('X-Session-Token')
  if (!token) {
    return { error: 'Authentication failed. Please try again.' }
  }

  await createSession(token)
  redirect('/')
}

export async function signUp(
  _state: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const passwordConfirmation = formData.get('password_confirmation') as string

  const response = await fetch('http://localhost:3000/sign_up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const messages = Object.entries(body).flatMap(([field, msgs]) => {
      const label = field.replace(/_/g, ' ')
      const capitalized = label.charAt(0).toUpperCase() + label.slice(1)
      return (msgs as string[]).map((msg) => `${capitalized} ${msg}`)
    })
    return { error: messages.length > 0 ? messages.join('. ') : 'Something went wrong. Please try again.' }
  }

  redirect('/sign-in')
}

export async function signOut(): Promise<void> {
  await deleteSession()
  redirect('/sign-in')
}
