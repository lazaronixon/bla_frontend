import { GET } from '@/app/sign-out/route'

jest.mock('@/app/actions/auth', () => ({
  signOut: jest.fn().mockRejectedValue(new Error('NEXT_REDIRECT:/sign-in')),
}))

import { signOut } from '@/app/actions/auth'

describe('GET /sign-out', () => {
  it('calls signOut', async () => {
    await expect(GET()).rejects.toThrow('NEXT_REDIRECT:/sign-in')
    expect(signOut).toHaveBeenCalled()
  })
})
