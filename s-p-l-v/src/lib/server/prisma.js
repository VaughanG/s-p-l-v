// Prisma client instance
// https://www.prisma.io/docs/concepts/components/prisma-client/initializing-the-prisma-client
//
// This is a singleton, so we can import it anywhere in the app
// and it will be the same instance


import { PrismaClient } from '@prisma/client';
import { env } from "$env/dynamic/private";

global.prisma;
const prisma = global.__prisma || new PrismaClient();

if (env.NODE_ENV === 'development') { 
    global.__prisma = prisma;
}

export { prisma };