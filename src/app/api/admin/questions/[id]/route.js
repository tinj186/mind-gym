import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { isApproved } = body;

    const updated = await prisma.questionBank.update({
      where: { id: id }, // ID in QuestionBank is a string (e.g., seed-q1)
      data: { isApproved }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ Failed to update question:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    
    await prisma.questionBank.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Failed to delete question:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}