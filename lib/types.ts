export type Book = {
  id: number
  title: string
  author: string
  genre: string
  isbn: string
  copies: number
}

export type User = {
  id: number
  email_address: string
  role: string
  created_at: string
  updated_at: string
}

export type Borrowing = {
  id: number
  due_at: string
  returned_at: string | null
  created_at: string
  user: User
  book: Book
}
