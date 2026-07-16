/**
 * Prisma client singleton placeholder.
 * Connect MySQL later with: npx prisma init && npx prisma generate
 *
 * DATABASE_URL="mysql://user:pass@localhost:3306/hrms_db"
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma: any = null;

export function getPrisma() {
  if (!prisma) {
    console.warn("Prisma not configured — using mock data for this demo build.");
  }
  return prisma;
}

export { prisma };
