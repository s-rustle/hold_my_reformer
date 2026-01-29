import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, parseISO } from "date-fns";
import type { EventType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const from = start ? parseISO(start) : startOfMonth(new Date());
  const to = end ? parseISO(end) : endOfMonth(new Date());

  const events = await prisma.event.findMany({
    where: {
      start: { lt: to },
      end: { gt: from },
    },
    include: {
      createdBy: { select: { name: true } },
      bookings: {
        where: { status: "CONFIRMED" },
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { start: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const {
    title,
    type,
    start,
    end,
    maxParticipants = 1,
    creditsRequired = 1,
  } = body as {
    title: string;
    type: EventType;
    start: string;
    end: string;
    maxParticipants?: number;
    creditsRequired?: number;
  };
  if (!title || !type || !start || !end) {
    return NextResponse.json(
      { error: "Missing title, type, start, or end" },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: {
      title,
      type,
      start: new Date(start),
      end: new Date(end),
      maxParticipants: type === "CLASS" ? maxParticipants : 1,
      creditsRequired: creditsRequired ?? 1,
      createdById: session.user.id,
    },
    include: {
      createdBy: { select: { name: true } },
      bookings: true,
    },
  });
  return NextResponse.json(event);
}
