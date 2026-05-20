"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * RESTORED CORE FUNCTION:
 * Updates the student's primary level (Division) and refreshes the layout cache.
 */
export async function updateStudentDivision(studentId, level) {
  await prisma.studentProfile.upsert({
    where: { id: studentId },
    update: { primaryLevel: level },
    create: {
      id: studentId,
      primaryLevel: level,
    },
  });
  revalidatePath("/");
}

/**
 * Creates a new student record in the database.
 * @param {FormData} formData - The form data containing student details.
 * @returns {Promise<{success: boolean, message?: string, student?: object}>}
 */
export async function createStudentAction(formData) {
  const name = formData.get('name');
  const gradeLevel = formData.get('gradeLevel') || 'Primary 1'; // Default to 'P1'
  const externalId = formData.get('externalId');

  if (!name || !externalId) {
    return { success: false, message: "Name and External ID are required." };
  }

  try {
    const newStudent = await prisma.studentProfile.create({
      data: {
        name: name.toString(),
        externalId: externalId.toString(),
        primaryLevel: gradeLevel.toString(),
      },
    });
    revalidatePath("/admin/students"); // Revalidate the student list page
    return { success: true, student: newStudent };
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint violation
      return { success: false, message: `Student with ID "${externalId}" already exists.` };
    }
    console.error("Error creating student:", error);
    return { success: false, message: "Failed to create student." };
  }
}

/**
 * Returns all students sorted by most recently created.
 * @returns {Promise<{success: boolean, message?: string, students?: object[]}>}
 */
export async function getStudentListAction() {
  try {
    const students = await prisma.studentProfile.findMany({
      orderBy: { createdAt: 'desc' }, // Sort by most recently created
    });
    return { success: true, students };
  } catch (error) {
    console.error("Error fetching student list:", error);
    return { success: false, message: "Failed to fetch student list." };
  }
}

/**
 * Resets a student's progress by deleting all associated AttemptLog and StudentMastery entries,
 * and clearing their active workout session.
 * @param {string} studentId - The ID of the student to reset.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function resetStudentProgressAction(studentId) {
  try {
    await prisma.$transaction([
      // 1. Delete all AttemptLog entries for the student
      prisma.attemptLog.deleteMany({
        where: { studentId: studentId },
      }),
      // 2. Delete all StudentMastery entries for the student
      prisma.studentMastery.deleteMany({
        where: { studentId: studentId },
      }),
      // 3. Clear any active workout session for the student
      prisma.studentProfile.update({
        where: { id: studentId },
        data: { activeWorkout: null },
      }),
    ]);
    revalidatePath(`/admin/students/${studentId}`); // Revalidate the student's dashboard
    revalidatePath("/admin/students"); // Revalidate the student list
    return { success: true, message: "Student progress reset successfully." };
  } catch (error) {
    console.error("Error resetting student progress:", error);
    return { success: false, message: "Failed to reset student progress." };
  }
}
```

```diff
