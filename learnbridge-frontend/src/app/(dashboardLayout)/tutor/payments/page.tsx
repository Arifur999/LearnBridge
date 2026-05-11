import DashPageHeader from "@/components/layout/DashPageHeader";
import { paymentService } from "@/services/payment.service";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default async function TutorPaymentsPage() {
  const payments = await paymentService.getTutorPayments();
  const list = Array.isArray(payments) ? payments : [];
  const total = list.reduce((sum, p) => sum + Number((p as Record<string, unknown>)?.amount ?? (p as Record<string, unknown>)?.price ?? 0), 0);

  return (
    <div className="space-y-6">
      <DashPageHeader title="Payments" description="Your earnings from completed sessions." />

      <Card className="max-w-xs">
        <CardContent className="pt-6">
          <div className="mb-2 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <DollarSign className="size-5" />
          </div>
          <p className="text-3xl font-bold">${total.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total Earnings</p>
        </CardContent>
      </Card>

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
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((p: Record<string, unknown>, i: number) => {
                const student = p?.student as Record<string, unknown> | undefined;
                return (
                  <tr key={String(p.id ?? i)} className="hover:bg-muted/30">
                    <td className="px-4 py-3">{formatDate(String(p.createdAt ?? ""))}</td>
                    <td className="px-4 py-3">{String(student?.name ?? p.studentName ?? "—")}</td>
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
