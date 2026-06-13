import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

/**
 * Utility to fetch the current authenticated user's Student Profile ID.
 * Creates a default student profile if one does not exist.
 */
export async function getCurrentStudentId() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  let profile = await prisma.studentProfile.findFirst({
    where: { userId: userId }
  });

  if (!profile) {
    profile = await prisma.studentProfile.create({
      data: {
        userId: userId,
        name: session.user.name || "Student",
        externalId: `ext-${userId}`,
        primaryLevel: "Primary 1"
      }
    });
  }

  return profile.id;
}
