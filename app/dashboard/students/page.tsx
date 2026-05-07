import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { Users, UserCheck, UserPlus, Search, User } from "lucide-react";

export default async function StudentsPage() {
  const { userId } = auth();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { course: { instructorId: user?.id } },
    include: {
      user: true,
      course: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="md:ml-80 bg-dark min-h-screen relative overflow-hidden">
      <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-6">
            Apprenants
          </h1>
          <p className="text-slate-500 font-medium text-xl leading-snug">
            Gérez votre communauté d'étudiants et suivez leur progression en temps réel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bento-card bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-4xl font-black text-white mb-1">{enrollments.length}</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Inscrits</p>
          </div>
          <div className="bento-card bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-4xl font-black text-white mb-1">
              {enrollments.filter(e => e.status === "COMPLETED").length}
            </p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Certifiés</p>
          </div>
          <div className="bento-card bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <UserPlus className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-4xl font-black text-white mb-1">
              {enrollments.filter(e => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return e.createdAt > oneWeekAgo;
              }).length}
            </p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Nouveaux (7j)</p>
          </div>
        </div>

        <div className="bento-card border border-white/5 bg-white/[0.01]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Apprenant</th>
                  <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Formation</th>
                  <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Progression</th>
                  <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500 font-bold">Aucun apprenant pour le moment.</td>
                  </tr>
                ) : (
                  enrollments.map((e) => (
                    <tr key={e.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
                            {e.user.firstName?.[0] || <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{e.user.firstName} {e.user.lastName}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{e.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors">{e.course.title}</p>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                            <div className="h-full bg-secondary rounded-full" style={{ width: `${e.totalProgress}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-white">{Math.round(e.totalProgress)}%</span>
                        </div>
                      </td>
                      <td className="py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
