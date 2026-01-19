import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if DATABASE_URL is a valid connection (not placeholder)
const isValidDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  return url && !url.includes('placeholder');
};

// Create Prisma client only when we have a valid database URL
const createPrismaClient = () => {
  if (!isValidDatabaseUrl()) {
    // Return a mock client during build or when no DB is configured
    console.warn('DATABASE_URL not configured - using mock Prisma client');
    return null as unknown as PrismaClient;
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
