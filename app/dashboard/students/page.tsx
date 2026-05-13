import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user-utils";
import { Search, Mail, BookOpen, Clock, MoreHorizontal, User as UserIcon, ExternalLink } from "lucide-react";
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestion des Apprenants</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Suivez la progression et communiquez avec vos élèves en temps réel.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
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
            <h3 className="text-xl font-bold text-gray-900 mb-3">Votre classe est encore vide</h3>
            <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium leading-relaxed">
              Une fois que vos élèves seront inscrits, vous pourrez suivre leur progression détaillée ici.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-50">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Apprenant</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Formation</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status / Prog.</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inscription</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-base overflow-hidden border border-secondary/5 shadow-sm group-hover:scale-105 transition-transform">
                            {enrollment.user.imageUrl ? (
                              <img src={enrollment.user.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{enrollment.user.firstName?.[0]}{enrollment.user.lastName?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 mb-0.5">{enrollment.user.firstName} {enrollment.user.lastName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{enrollment.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-gray-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-secondary" />
                          </div>
                          <span className="text-sm font-bold text-gray-700 line-clamp-1">{enrollment.course.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-full max-w-[140px]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black text-secondary tracking-widest uppercase">{enrollment.totalProgress}%</span>
                            {enrollment.status === 'COMPLETED' && <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500 text-white rounded font-black uppercase">Terminé</span>}
                          </div>
                          <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <div
                              className={`h-full transition-all duration-1000 ease-out ${enrollment.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-secondary'}`}
                              style={{ width: `${enrollment.totalProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-gray-400 font-bold">
                          <Clock className="w-4 h-4 text-gray-300" />
                          <span className="text-xs">
                            {new Date(enrollment.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <a
                             href={`mailto:${enrollment.user.email}`}
                             className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm"
                             title="Contacter l'apprenant"
                           >
                             <Mail className="w-4 h-4" />
                           </a>
                           <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200">
                             <ExternalLink className="w-4 h-4" />
                           </button>
                        </div>
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
