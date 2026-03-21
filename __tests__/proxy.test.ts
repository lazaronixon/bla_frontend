/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { proxy } from '@/proxy'

function makeRequest(path: string, sessionCookie?: string): NextRequest {
  const url = `http://localhost:3001${path}`
  const req = new NextRequest(url)
  if (sessionCookie) {
    req.cookies.set('bla_session', sessionCookie)
  }
  return req
}

describe('proxy', () => {
  describe('protected routes', () => {
    it('redirects to /sign-in when accessing / without a session', () => {
      const req = makeRequest('/')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/sign-in')
    })

    it('allows access to / with a valid session cookie', () => {
      const req = makeRequest('/', 'some-token')
      const res = proxy(req)
      expect(res.status).toBe(200)
    })
  })

  describe('public routes', () => {
    it('allows access to /sign-in without a session', () => {
      const req = makeRequest('/sign-in')
      const res = proxy(req)
      expect(res.status).toBe(200)
    })

    it('redirects to / when accessing /sign-in with an existing session', () => {
      const req = makeRequest('/sign-in', 'some-token')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/')
    })
  })
})
