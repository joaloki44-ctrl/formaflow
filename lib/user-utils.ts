import { auth, currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";

/**
 * Ensures the Clerk user is synchronized with the Prisma database.
 * Uses upsert to prevent race conditions during concurrent server component renders.
 */
export async function getOrCreateUser() {
  const { userId } = auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const firstName = clerkUser.firstName || "";
  const lastName = clerkUser.lastName || "";
  const imageUrl = clerkUser.imageUrl || "";

  try {
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        lastActiveAt: new Date(),
      },
      create: {
        clerkId: userId,
        email,
        firstName,
        lastName,
        imageUrl,
        role: "INSTRUCTOR",
      },
    });

    return user;
  } catch (error) {
    console.error("[GET_OR_CREATE_USER]", error);
    // Fallback to findUnique if upsert fails (e.g. concurrent upsert)
    return await prisma.user.findUnique({
      where: { clerkId: userId },
    });
  }
}
