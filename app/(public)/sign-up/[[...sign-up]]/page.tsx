import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream pt-32 pb-20 px-6">
      <SignUp />
    </div>
  );
}
