import DashPageHeader from "@/components/layout/DashPageHeader";
import { instituteService } from "@/services/institute.service";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function InstitutePaymentsPage() {
  const payments = await instituteService.getPayments();
  const list = Array.isArray(payments) ? payments : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="Payments" description="Revenue from course enrollments." />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">No payment records.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Student</th>
                <th className="px-4 py-3 text-left font-semibold">Course</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((p: Record<string, unknown>, i: number) => {
                const student = p?.student as Record<string, unknown> | undefined;
                const course = p?.course as Record<string, unknown> | undefined;
                return (
                  <tr key={String(p.id ?? i)} className="hover:bg-muted/30">
                    <td className="px-4 py-3">{formatDate(String(p.createdAt ?? ""))}</td>
                    <td className="px-4 py-3">{String(student?.name ?? "—")}</td>
                    <td className="px-4 py-3">{String(course?.title ?? "—")}</td>
                    <td className="px-4 py-3 font-semibold">${String(p.amount ?? p.price ?? 0)}</td>
                    <td className="px-4 py-3"><Badge variant="default">{String(p.status ?? "PAID")}</Badge></td>
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
