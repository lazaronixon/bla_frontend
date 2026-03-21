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

    it('redirects to /sign-in when accessing /librarian/books without a session', () => {
      const req = makeRequest('/librarian/books')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/sign-in')
    })

    it('redirects a member away from /librarian/books', () => {
      const req = makeRequest('/librarian/books', 'some-token')
      req.cookies.set('bla_role', 'member')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('http://localhost:3001/')
    })

    it('allows a librarian to access /librarian/books', () => {
      const req = makeRequest('/librarian/books', 'some-token')
      req.cookies.set('bla_role', 'librarian')
      const res = proxy(req)
      expect(res.status).toBe(200)
    })

    it('redirects to /member when accessing / with a session and no role cookie', () => {
      const req = makeRequest('/', 'some-token')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/member')
    })

    it('redirects to /librarian when accessing / with a librarian session', () => {
      const req = makeRequest('/', 'some-token')
      req.cookies.set('bla_role', 'librarian')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/librarian')
    })
  })

  describe('public routes', () => {
    it('allows access to /sign-in without a session', () => {
      const req = makeRequest('/sign-in')
      const res = proxy(req)
      expect(res.status).toBe(200)
    })

    it('redirects to /member when accessing /sign-in with an existing session and no role', () => {
      const req = makeRequest('/sign-in', 'some-token')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/member')
    })

    it('redirects to /librarian when accessing /sign-in with a librarian session', () => {
      const req = makeRequest('/sign-in', 'some-token')
      req.cookies.set('bla_role', 'librarian')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/librarian')
    })

    it('allows access to /sign-up without a session', () => {
      const req = makeRequest('/sign-up')
      const res = proxy(req)
      expect(res.status).toBe(200)
    })

    it('redirects to /member when accessing /sign-up with an existing session and no role', () => {
      const req = makeRequest('/sign-up', 'some-token')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/member')
    })
  })
})
