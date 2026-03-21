jest.mock('server-only', () => ({}))

const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
}

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookieStore)),
}))

import { getSession, createSession, deleteSession } from '@/lib/session'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getSession', () => {
  it('returns the session token when the cookie exists', async () => {
    mockCookieStore.get.mockReturnValue({ value: 'my-token' })
    expect(await getSession()).toBe('my-token')
    expect(mockCookieStore.get).toHaveBeenCalledWith('bla_session')
  })

  it('returns undefined when the cookie does not exist', async () => {
    mockCookieStore.get.mockReturnValue(undefined)
    expect(await getSession()).toBeUndefined()
  })
})

describe('createSession', () => {
  it('sets the session cookie with the given token and maxAge', async () => {
    await createSession('abc123', 3600)
    expect(mockCookieStore.set).toHaveBeenCalledWith('bla_session', 'abc123', expect.objectContaining({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 3600,
    }))
  })

  it('sets secure:true in production', async () => {
    const original = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true })
    await createSession('tok', 60)
    expect(mockCookieStore.set).toHaveBeenCalledWith('bla_session', 'tok', expect.objectContaining({ secure: true }))
    Object.defineProperty(process.env, 'NODE_ENV', { value: original, configurable: true })
  })

  it('sets secure:false outside production', async () => {
    await createSession('tok', 60)
    expect(mockCookieStore.set).toHaveBeenCalledWith('bla_session', 'tok', expect.objectContaining({ secure: false }))
  })
})

describe('deleteSession', () => {
  it('deletes the session cookie', async () => {
    await deleteSession()
    expect(mockCookieStore.delete).toHaveBeenCalledWith('bla_session')
  })
})
