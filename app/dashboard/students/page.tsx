import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user-utils";
import { Search, Mail, BookOpen, Clock, MoreHorizontal, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default async function StudentsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

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

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Apprenants</h1>
          <p className="text-muted mt-1 font-medium text-sm">Gérez et suivez la progression de vos étudiants.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            className="pl-12 pr-4 py-3 border border-gray-100 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all w-full shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {enrollments.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-24 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Aucun apprenant pour le moment</h3>
            <p className="text-muted max-w-xs mx-auto text-sm font-medium leading-relaxed">
              Dès qu'un étudiant s'inscrit à l'une de vos formations, il apparaîtra ici avec son suivi de progression.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-50">
                    <th className="px-8 py-6 text-xs font-bold text-muted uppercase tracking-widest">Apprenant</th>
                    <th className="px-8 py-6 text-xs font-bold text-muted uppercase tracking-widest">Formation</th>
                    <th className="px-8 py-6 text-xs font-bold text-muted uppercase tracking-widest">Progression</th>
                    <th className="px-8 py-6 text-xs font-bold text-muted uppercase tracking-widest">Date d'inscription</th>
                    <th className="px-8 py-6 text-xs font-bold text-muted uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-base overflow-hidden border border-secondary/5 shadow-sm">
                            {enrollment.user.imageUrl ? (
                              <img src={enrollment.user.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{enrollment.user.firstName?.[0]}{enrollment.user.lastName?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary mb-0.5">{enrollment.user.firstName} {enrollment.user.lastName}</p>
                            <p className="text-[11px] text-muted font-bold tracking-tight">{enrollment.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-gray-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-secondary" />
                          </div>
                          <span className="text-sm font-bold text-primary line-clamp-1">{enrollment.course.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-full max-w-[140px]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-secondary tracking-tighter uppercase">{enrollment.totalProgress}% terminé</span>
                          </div>
                          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <div
                              className="h-full bg-secondary transition-all duration-700 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                              style={{ width: `${enrollment.totalProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-muted font-bold">
                          <Clock className="w-4 h-4 text-gray-300" />
                          <span className="text-xs">
                            {new Date(enrollment.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-muted hover:text-primary border border-transparent hover:border-gray-100">
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
