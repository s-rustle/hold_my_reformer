import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id, status: "CONFIRMED" },
    include: {
      event: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { eventId } = body as { eventId: string };
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const [event, user, existing] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId }, include: { bookings: true } }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.booking.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId } },
    }),
  ]);

  if (!event || !user) {
    return NextResponse.json({ error: "Event or user not found" }, { status: 404 });
  }
  if (existing && existing.status === "CONFIRMED") {
    return NextResponse.json({ error: "Already booked" }, { status: 400 });
  }

  const confirmedCount = event.bookings.filter((b) => b.status === "CONFIRMED").length;
  if (confirmedCount >= event.maxParticipants) {
    return NextResponse.json({ error: "Class or slot is full" }, { status: 400 });
  }
  if (user.credits < event.creditsRequired) {
    return NextResponse.json(
      { error: "Not enough credits", required: event.creditsRequired, have: user.credits },
      { status: 400 }
    );
  }

  const booking = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.create({
      data: {
        userId: session.user!.id,
        eventId,
        creditsUsed: event.creditsRequired,
        status: "CONFIRMED",
      },
      include: { event: true },
    });
    await tx.user.update({
      where: { id: session.user!.id },
      data: { credits: { decrement: event.creditsRequired } },
    });
    return b;
  });

  return NextResponse.json(booking);
}
