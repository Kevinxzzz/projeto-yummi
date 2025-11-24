import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";
export const prisma = new PrismaClient();
