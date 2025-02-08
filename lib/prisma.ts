import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
  prismaServiceRole: PrismaClient
}

// Cliente Prisma padrão para operações gerais
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

// Cliente Prisma com service role apenas para operações específicas
export const prismaServiceRole =
  globalForPrisma.prismaServiceRole ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL_SERVICE_ROLE
      }
    }
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaServiceRole = prismaServiceRole
}

// Log das conexões (sem informações sensíveis)
try {
  const dbUrl = process.env.DATABASE_URL || 'not set'
  const serviceRoleUrl = process.env.DATABASE_URL_SERVICE_ROLE || 'not set'
  console.log('Database connection:', dbUrl.replace(/:[^:@]+@/, ':****@'))
  console.log('Service role connection:', serviceRoleUrl.replace(/:[^:@]+@/, ':****@'))
} catch (error) {
  console.error('Error logging database URLs:', error)
}