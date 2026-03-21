/**
 * @jest-environment node
 */
import { signUp } from '@/app/actions/auth'
import { BACKEND_URL } from '@/lib/config'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

jest.mock('@/lib/session', () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}))

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value)
  }
  return fd
}

describe('signUp', () => {
  it('redirects to /sign-in on successful registration', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, email_address: 'user@example.com', role: 'member' }),
    })

    await expect(
      signUp(undefined, makeFormData({
        email: 'user@example.com',
        password: 'secret123',
        password_confirmation: 'secret123',
      }))
    ).rejects.toThrow('NEXT_REDIRECT:/sign-in')
  })

  it('returns formatted errors from API on 422', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        email_address: ['has already been taken'],
        password: ['is too short (minimum is 6 characters)'],
      }),
    })

    const result = await signUp(undefined, makeFormData({
      email: 'taken@example.com',
      password: 'short',
      password_confirmation: 'short',
    }))

    expect(result).toEqual({
      error: 'Email address has already been taken. Password is too short (minimum is 6 characters)',
    })
  })

  it('returns a generic error when response body is empty', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })

    const result = await signUp(undefined, makeFormData({
      email: 'user@example.com',
      password: 'short',
      password_confirmation: 'short',
    }))

    expect(result).toEqual({ error: 'Something went wrong. Please try again.' })
  })

  it('sends the correct request body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })

    await expect(
      signUp(undefined, makeFormData({
        email: 'user@example.com',
        password: 'secret123',
        password_confirmation: 'secret123',
      }))
    ).rejects.toThrow('NEXT_REDIRECT:/sign-in')

    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/sign_up`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email_address: 'user@example.com',
          password: 'secret123',
          password_confirmation: 'secret123',
        }),
      })
    )
  })
})
