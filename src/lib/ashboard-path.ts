import { Role } from '@prisma/client'

/** Maps an authenticated user's role to their dashboard route. */
export function getDashboardPath(role: Role): string {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'CENTRAL':
      return '/central'
    case 'STATE':
      return '/state'
    case 'DISTRICT':
      return '/district'
    case 'AGENCY':
      return '/agency'
    default:
      return '/citizen-lookup'
  }
}