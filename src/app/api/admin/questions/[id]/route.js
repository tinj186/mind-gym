import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await prisma.questionBank.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ Failed to update question:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    // 🔍 1. Check for operational student logs referencing this question
    const attemptCount = await prisma.attemptLog.count({
      where: { questionId: id }
    });

    if (attemptCount > 0) {
      // 📦 Case A: Attempt lock active. Soft-delete to shield relational integrity.
      const archivedQuestion = await prisma.questionBank.update({
        where: { id },
        data: { isArchived: true },
      });
      return NextResponse.json({ success: true, action: 'archived', count: attemptCount });
    } else {
      // 🧼 Case B: Pristine record. Hard-delete to maintain inventory hygiene.
      await prisma.questionBank.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, action: 'purged' });
    }
  } catch (error) {
    console.error("❌ Failed to safely process conditional delete:", error);
    return NextResponse.json({ error: "Failed to delete question safely" }, { status: 500 });
  }
}