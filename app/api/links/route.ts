import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, url, thumbnail, icon } = await req.json();

  if (!title || !url) {
    return NextResponse.json({ error: "Missing title or url" }, { status: 400 });
  }

  // Get current max order to append at the end
  const lastLink = await prisma.link.findFirst({
    where: { userId: session.user.id },
    orderBy: { order: "desc" },
  });

  const nextOrder = lastLink ? lastLink.order + 1 : 0;

  const newLink = await prisma.link.create({
    data: {
      title,
      url,
      thumbnail,
      icon,
      order: nextOrder,
      userId: session.user.id,
    },
  });

  return NextResponse.json(newLink);
}
