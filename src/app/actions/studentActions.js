"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Updates the student's primary level (Division) and refreshes the cache.
 * 
 * @param {string} studentId - The unique ID of the student profile.
 * @param {string} level - The selected Singapore MOE division (e.g., "Primary 1").
 */
export async function updateStudentDivision(studentId, level) {
  await prisma.studentProfile.upsert({
    where: { id: studentId },
    update: { primaryLevel: level },
    create: {
      id: studentId, // Use the provided studentId for creation
      primaryLevel: level,
      // Add any other required fields for StudentProfile creation here if they are not nullable
      // For example: userId: "some-default-user-id" if userId is not nullable and not auto-generated
    },
  });
  revalidatePath("/");
}
