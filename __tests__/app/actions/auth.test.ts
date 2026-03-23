import { signIn, signUp, signOut } from '@/app/actions/auth'
import { BACKEND_URL } from '@/lib/config'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

jest.mock('@/lib/session', () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
  setRoleCookie: jest.fn(),
  deleteRoleCookie: jest.fn(),
}))

import { createSession, deleteSession } from '@/lib/session'

const mockCreateSession = createSession as jest.Mock
const mockDeleteSession = deleteSession as jest.Mock

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v))
  return fd
}

const signInData = { email: 'a@b.com', password: 'pass' }
const signUpData = { email: 'a@b.com', password: 'pass', password_confirmation: 'pass' }

describe('signIn', () => {
  it('returns error when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, headers: new Headers() })
    const result = await signIn(undefined, makeFormData(signInData))
    expect(result).toEqual({ error: 'Invalid email or password.' })
  })

  it('returns error when token is missing', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, headers: new Headers() })
    const result = await signIn(undefined, makeFormData(signInData))
    expect(result).toEqual({ error: 'Authentication failed. Please try again.' })
  })

  it('redirects to / on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'X-Session-Token': 'my-token', 'X-Session-Expires-In': '3600' }),
      json: async () => ({ role: 'member' }),
    })
    await expect(signIn(undefined, makeFormData(signInData))).rejects.toThrow('NEXT_REDIRECT:/')
    expect(mockCreateSession).toHaveBeenCalledWith('my-token', 3600)
  })

  it('posts to the correct endpoint with correct body', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, headers: new Headers() })
    await signIn(undefined, makeFormData({ email: 'a@b.com', password: 'secret' }))
    expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/sign_in`, expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email_address: 'a@b.com', password: 'secret' }),
    }))
  })
})

describe('signUp', () => {
  it('redirects to /sign-in on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    await expect(signUp(undefined, makeFormData(signUpData))).rejects.toThrow('NEXT_REDIRECT:/sign-in')
  })

  it('returns formatted error messages on failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ email_address: ['has already been taken'] }),
    })
    const result = await signUp(undefined, makeFormData(signUpData))
    expect(result).toEqual({ errors: ['Email address has already been taken'], values: { email: 'a@b.com' } })
  })

  it('returns generic error when body is unparseable', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => { throw new Error() },
    })
    const result = await signUp(undefined, makeFormData(signUpData))
    expect(result).toEqual({ errors: ['Something went wrong. Please try again.'], values: { email: 'a@b.com' } })
  })

  it('posts to the correct endpoint with correct body', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    await expect(signUp(undefined, makeFormData({ email: 'a@b.com', password: 'pass', password_confirmation: 'pass' }))).rejects.toThrow('NEXT_REDIRECT:/sign-in')
    expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/sign_up`, expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email_address: 'a@b.com', password: 'pass', password_confirmation: 'pass' }),
    }))
  })
})

describe('signOut', () => {
  it('deletes session and redirects to /sign-in', async () => {
    await expect(signOut()).rejects.toThrow('NEXT_REDIRECT:/sign-in')
    expect(mockDeleteSession).toHaveBeenCalled()
  })
})
