import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
            otp: { label: 'OTP', type: 'text' },
            adminKey: { label: 'Admin Key', type: 'text' },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                throw new Error('Missing credentials')
            }
            
            const user = await prisma.user.findUnique({ where: { email: credentials.email } })
            if (!user) throw new Error('No account found with this email')
                
            const isValidPassword = await bcrypt.compare(credentials.password, user.password)
            if (!isValidPassword) throw new Error('Incorrect password')
            
            if (user.verificationStatus === 'PENDING') {
                throw new Error('Your account is still under verification.')
            }
            if (user.verificationStatus === 'REJECTED') {
                throw new Error(user.rejectionReason || 'Your account was rejected.')
            }
            
            // --- Admin login path ---
            if (credentials.adminKey) {
                if (user.role !== 'ADMIN') {
                    throw new Error('Not an admin account')
                }
                if (credentials.adminKey !== process.env.ADMIN_ACCESS_KEY) {
                    throw new Error('Invalid admin key')
                }
                return { id: user.id, name: user.name, email: user.email, role: user.role, state: user.state, district: user.district, agencyName: user.agencyName, }
            }
            
            // --- Normal OTP login path ---
            if (!credentials.otp) throw new Error('Missing credentials')

            const otpRecord = await prisma.otpVerification.findFirst({
                where: { email: credentials.email, otp: credentials.otp },
                orderBy: { createdAt: 'desc' },
            })
            if (!otpRecord) throw new Error('Invalid code')
            if (otpRecord.expiresAt < new Date()) throw new Error('Code expired, please resend')
            
            await prisma.otpVerification.deleteMany({ where: { email: credentials.email } })
            
            return { id: user.id, name: user.name, email: user.email, role: user.role, state: user.state, district: user.district }
        },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.state = (user as any).state
        token.district = (user as any).district
        token.agencyName = (user as any).agencyName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.state = token.state as string | null
        session.user.district = token.district as string | null
        session.user.agencyName = token.agencyName as string | null
      }
      return session
    },
  },
  pages: { signIn: '/login' },
}