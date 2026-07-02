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

  const profile = await prisma.studentProfile.upsert({
    where: { externalId: `ext-${userId}` },
    update: {},
    create: {
      userId: userId,
      name: session.user.name || "Student",
      externalId: `ext-${userId}`,
      primaryLevel: "Primary 1"
    }
  });

  return profile.id;
}

/**
 * Enforces that the current user has an ACTIVE subscription.
 * If not, redirects them to the Parent Command Center to upgrade.
 */
import { redirect } from 'next/navigation';

export async function enforceActiveSubscription() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  
  if (user?.subscriptionStatus === 'INACTIVE') {
    redirect('/parent');
  }
}
