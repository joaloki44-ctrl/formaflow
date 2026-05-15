import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function PATCH(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const body = await req.json();

    // Filter body to only include fields that exist in the schema
    const updateData: any = {};
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.notificationsEnabled !== undefined) updateData.notificationsEnabled = body.notificationsEnabled;
    if (body.weeklyReportsEnabled !== undefined) updateData.weeklyReportsEnabled = body.weeklyReportsEnabled;
    if (body.marketingEmails !== undefined) updateData.marketingEmails = body.marketingEmails;
    if (body.theme !== undefined) updateData.theme = body.theme;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Erreur lors de la mise à jour", { status: 500 });
  }
}
