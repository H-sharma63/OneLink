import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
      bio: true,
      banner: true,
      theme: true,
      themeConfig: true,
      socials: true,
      onboarded: true,
      views: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, bio, banner, theme, image, username, socials, themeConfig, onboarded } = await req.json();

  // If changing username, check availability
  if (username && username !== session.user.username) {
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json({ error: "Username taken" }, { status: 409 });
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio,
      banner,
      theme,
      image,
      username,
      socials,
      themeConfig,
      onboarded,
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete the user (Prisma cascade delete will handle related links/accounts if configured)
    await prisma.user.delete({
      where: { id: session.user.id }
    });
    
    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

