import { auth, currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let user = null;

  try {
    user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
  } catch (error) {
    console.error("Database connection error in Dashboard:", error);
    throw error;
  }

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      redirect("/sign-in");
    }

    try {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          imageUrl: clerkUser.imageUrl || "",
          role: "INSTRUCTOR",
        },
      });
    } catch (error) {
      console.error("User creation error in sync gap:", error);
      throw error;
    }
  }

  try {
    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const totalCourses = await prisma.course.count({
      where: { instructorId: user.id },
    });

    const totalStudents = await prisma.enrollment.count({
      where: {
        course: { instructorId: user.id },
      },
    });

    // Calculate total revenue by summing course prices
    const enrollmentsWithCourses = await prisma.enrollment.findMany({
      where: {
        course: { instructorId: user.id },
      },
      include: {
        course: { select: { price: true } },
      },
    });

    const totalRevenue = enrollmentsWithCourses.reduce(
      (sum, enrollment) => sum + (enrollment.course?.price || 0),
      0
    );

    return (
      <div className="md:ml-80 bg-cream min-h-screen">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Bonjour, {user.firstName}
              </h1>
              <p className="text-muted">
                Gérez vos cours et suivez vos performances
              </p>
            </div>

            <Link
              href="/dashboard/courses/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-secondary text-white rounded-lg font-semibold text-sm hover:bg-secondary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nouveau cours
            </Link>
          </div>

          <div className="mb-12">
            <DashboardStats
              totalCourses={totalCourses}
              totalStudents={totalStudents}
              totalRevenue={totalRevenue}
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">
                Mes cours récents
              </h2>
              <Link
                href="/dashboard/courses"
                className="text-sm font-medium text-secondary hover:underline"
              >
                Voir tout
              </Link>
            </div>
            <CoursesList courses={courses} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Critical Dashboard Logic Error:", error);
    throw error;
  }
}
