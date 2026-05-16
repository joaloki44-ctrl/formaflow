import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user-utils";
import LearnerNav from "@/components/learner/LearnerNav";

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  if (!user.onboardingDone) redirect("/onboarding");

  // Seuls les particuliers accèdent à /learn
  if (user.role !== "STUDENT" && user.role !== "ADMIN") {
    if (user.role === "INSTRUCTOR") redirect("/dashboard");
    if (user.role === "COMPANY") redirect("/org/new");
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <LearnerNav user={{ firstName: user.firstName, lastName: user.lastName, imageUrl: user.imageUrl }} />
      <main className="pt-16">{children}</main>
    </div>
  );
}
