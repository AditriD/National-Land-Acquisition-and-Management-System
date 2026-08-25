import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    role: string
    state?: string | null
    district?: string | null
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role: string
      state?: string | null
      district?: string | null
      agencyName?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    state?: string | null
    district?: string | null
    agencyName?: string | null
  }
}