'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'

export type SignInState = { error?: string } | undefined

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

export async function signOut(): Promise<void> {
  await deleteSession()
  redirect('/sign-in')
}
