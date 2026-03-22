export type Book = {
  id: number
  title: string
  author: string
  genre: string
  isbn: string
  copies: number
}

export type BookUser = {
  id: number
  email_address: string
  role: string
}

export type Borrowing = {
  id: number
  due_at: string
  returned_at: string | null
  created_at: string
  user: BookUser
  book: Book
}
