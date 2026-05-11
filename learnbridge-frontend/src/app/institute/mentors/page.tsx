import DashPageHeader from "@/components/layout/DashPageHeader";
import { instituteService } from "@/services/institute.service";
import { Users } from "lucide-react";

export default async function InstituteMentorsPage() {
  const mentors = await instituteService.getMentors();
  const list = Array.isArray(mentors) ? mentors : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="Mentors" description="Mentors assigned to your institute." />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <Users className="mx-auto mb-4 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No mentors yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Specialization</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((m: Record<string, unknown>, i: number) => {
                const user = m?.user as Record<string, unknown> | undefined;
                return (
                  <tr key={String(m.id ?? i)} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{String(user?.name ?? "—")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{String(user?.email ?? "—")}</td>
                    <td className="px-4 py-3">{String(m.specialization ?? "—")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
