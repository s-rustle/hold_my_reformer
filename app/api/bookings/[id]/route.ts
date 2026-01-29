import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type TransactionClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { event: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (booking.status === "CANCELLED") {
    return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
  }

  await prisma.$transaction(async (tx: TransactionClient) => {
    await tx.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    if (booking.userId === session.user!.id) {
      await tx.user.update({
        where: { id: booking.userId },
        data: { credits: { increment: booking.creditsUsed } },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
