import DashPageHeader from "@/components/layout/DashPageHeader";
import { paymentService } from "@/services/payment.service";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminPaymentsPage() {
  const result = await paymentService.getAllPayments();
  const list = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="Payments" description="All platform payment transactions." />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">No payment records found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Student</th>
                <th className="px-4 py-3 text-left font-semibold">Tutor</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((p: Record<string, unknown>, i) => {
                const student = p?.student as Record<string, unknown> | undefined;
                const tutor = p?.tutor as Record<string, unknown> | undefined;
                const tutorUser = tutor?.user as Record<string, unknown> | undefined;
                return (
                  <tr key={String(p.id ?? i)} className="hover:bg-muted/30">
                    <td className="px-4 py-3">{formatDate(String(p.createdAt ?? ""))}</td>
                    <td className="px-4 py-3">{String(student?.name ?? p.studentName ?? "—")}</td>
                    <td className="px-4 py-3">{String(tutorUser?.name ?? tutor?.name ?? p.tutorName ?? "—")}</td>
                    <td className="px-4 py-3 font-semibold">${String(p.amount ?? p.price ?? 0)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={String(p.status ?? "").toUpperCase() === "PAID" ? "default" : "outline"}>
                        {String(p.status ?? "PAID")}
                      </Badge>
                    </td>
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
