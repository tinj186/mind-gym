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
    await prisma.questionBank.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Failed to delete question:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}