import { PrismaClient } from '@prisma/client'
import { debug } from './debug'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Log the database URL (without sensitive information)
try {
  const dbUrl = process.env.DATABASE_URL || 'not set'
  debug.log('Prisma', 'Database connection:', dbUrl.replace(/:[^:@]+@/, ':****@'))
} catch (error) {
  debug.error('Prisma', 'Error logging database URL:', error)
}