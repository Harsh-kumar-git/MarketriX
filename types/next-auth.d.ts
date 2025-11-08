import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      subscriptionPlan: string
    }
  }

  interface User {
    role: string
    subscriptionPlan: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    subscriptionPlan: string
  }
}