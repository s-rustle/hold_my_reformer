import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "ADMIN") {
    const list = await prisma.healthHistory.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(list);
  }

  const own = await prisma.healthHistory.findUnique({
    where: { userId: session.user.id },
  });
  return NextResponse.json(own ? [own] : []);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const formData = typeof body === "string" ? body : JSON.stringify(body);
  if (!formData || formData === "{}") {
    return NextResponse.json(
      { error: "Form data is required" },
      { status: 400 }
    );
  }

  const record = await prisma.healthHistory.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      formData,
    },
    update: { formData },
  });
  return NextResponse.json(record);
}
