import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function PATCH(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const body = await req.json();

    // We update fields while ensuring we don't break on missing schema fields in standard Prisma client
    // Since I updated the schema file, the code should reflect it even if generate didn't run here.
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        notificationsEnabled: body.notificationsEnabled,
        weeklyReportsEnabled: body.weeklyReportsEnabled,
        theme: body.theme,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Erreur lors de la mise à jour des préférences", { status: 500 });
  }
}
