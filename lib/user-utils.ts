import { auth, currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";

/**
 * Ensures the Clerk user is synchronized with the Prisma database.
 * Returns the Prisma user object.
 */
export async function getOrCreateUser() {
  const { userId } = auth();
  if (!userId) return null;

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // If user doesn't exist in DB yet (webhook delay or missed), create them on the fly
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        imageUrl: clerkUser.imageUrl || "",
        role: "INSTRUCTOR", // Default role
      },
    });
  }

  return user;
}
