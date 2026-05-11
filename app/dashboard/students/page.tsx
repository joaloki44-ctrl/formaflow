import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user-utils";
import { Search, Mail, BookOpen, Clock, MoreHorizontal, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default async function StudentsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  // Get all enrollments for courses owned by this instructor
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: {
        instructorId: user.id,
      },
    },
    include: {
      user: true,
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Group by student or just list enrollments? Usually list enrollments is easier for "Students list" in LMS
  // or unique students. Let's do unique students with their course count and total progress.

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Apprenants</h1>
          <p className="text-muted mt-1 font-medium">Gérez et suivez la progression de vos étudiants.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {enrollments.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2rem] p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Aucun apprenant pour le moment</h3>
            <p className="text-muted max-w-xs mx-auto">
              Dès qu'un étudiant s'inscrit à l'une de vos formations, il apparaîtra ici.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Apprenant</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Formation</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Progression</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Date d'inscription</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm overflow-hidden">
                            {enrollment.user.imageUrl ? (
                              <img src={enrollment.user.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{enrollment.user.firstName?.[0]}{enrollment.user.lastName?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary">{enrollment.user.firstName} {enrollment.user.lastName}</p>
                            <p className="text-xs text-muted font-medium">{enrollment.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-secondary" />
                          <span className="text-sm font-medium text-primary line-clamp-1">{enrollment.course.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-full max-w-[120px]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{enrollment.totalProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary transition-all duration-500"
                              style={{ width: `${enrollment.totalProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-muted">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {new Date(enrollment.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-muted hover:text-primary">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
