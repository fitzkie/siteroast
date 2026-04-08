import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaStub() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error("Prisma is unavailable because DATABASE_URL is not set.");
      },
    },
  ) as PrismaClient;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Allow builds to complete in environments where DATABASE_URL
    // is only injected at runtime, such as Docker-based Railway builds.
    return createPrismaStub();
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
