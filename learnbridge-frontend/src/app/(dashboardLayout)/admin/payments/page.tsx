import { paymentService } from "@/services/payment.service";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, CheckCircle2, Clock, CreditCard } from "lucide-react";

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-rose-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

const STATUS_CFG: Record<string, { bg: string; textColor: string; dot: string }> = {
  PAID:    { bg: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  PENDING: { bg: "bg-amber-100 dark:bg-amber-900/30",     textColor: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500"   },
  FAILED:  { bg: "bg-red-100 dark:bg-red-900/30",         textColor: "text-red-700 dark:text-red-400",         dot: "bg-red-500"     },
};

export default async function AdminPaymentsPage() {
  const result = await paymentService.getAllPayments();
  const list: Record<string, unknown>[] = Array.isArray(result?.data)
    ? result.data
    : Array.isArray(result) ? result : [];

  const totalRevenue = list.reduce((s, p) => s + Number(p.amount ?? p.price ?? 0), 0);
  const paid    = list.filter((p) => String(p.status ?? "").toUpperCase() === "PAID").length;
  const pending = list.filter((p) => String(p.status ?? "").toUpperCase() === "PENDING").length;
  const failed  = list.filter((p) => String(p.status ?? "").toUpperCase() === "FAILED").length;

  const statCards = [
    { icon: DollarSign,   label: "Total Revenue",    value: `৳${totalRevenue.toFixed(0)}`, sub: "All transactions",       iconBg: "bg-emerald-100 dark:bg-emerald-900/30",  iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: "100%" },
    { icon: CreditCard,   label: "Transactions",     value: list.length,                   sub: "Total payment records",  iconBg: "bg-primary/10",                          iconColor: "text-primary",                           bar: "bg-primary",     barW: "100%" },
    { icon: CheckCircle2, label: "Paid",             value: paid,                          sub: "Successful payments",    iconBg: "bg-blue-100 dark:bg-blue-900/30",         iconColor: "text-blue-600 dark:text-blue-400",       bar: "bg-blue-500",    barW: list.length > 0 ? `${Math.round((paid / list.length) * 100)}%` : "0%" },
    { icon: Clock,        label: "Pending",          value: pending,                       sub: "Awaiting payment",       iconBg: "bg-amber-100 dark:bg-amber-900/30",       iconColor: "text-amber-600 dark:text-amber-400",     bar: "bg-amber-500",   barW: list.length > 0 ? `${Math.round((pending / list.length) * 100)}%` : "0%" },
    { icon: TrendingUp,   label: "Failed",           value: failed,                        sub: "Failed transactions",    iconBg: "bg-red-100 dark:bg-red-900/30",           iconColor: "text-red-600 dark:text-red-400",         bar: "bg-red-500",     barW: list.length > 0 ? `${Math.round((failed / list.length) * 100)}%` : "0%" },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All platform payment transactions
        </p>
      </div>

      {/* ── Stats Card ─────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-primary to-violet-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-5">
            {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, bar, barW }) => (
              <div key={label} className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className={`flex size-9 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Payments Table ─────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-[3px] w-full bg-linear-to-r from-emerald-500 to-primary" />
        <CardHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <CreditCard className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{list.length} total records</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
                <CreditCard className="size-8 text-muted-foreground/40" />
              </div>
              <p className="font-semibold">No payment records found</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden border-b bg-muted/40 sm:grid sm:grid-cols-[1.5fr_2fr_2fr_1.2fr_1fr] gap-4 px-5 py-3">
                {["Date", "Student", "Tutor", "Amount", "Status"].map((h) => (
                  <p key={h} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</p>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/60">
                {list.map((p, idx) => {
                  const student  = p?.student  as Record<string, unknown> | undefined;
                  const tutor    = p?.tutor    as Record<string, unknown> | undefined;
                  const tutorUser = tutor?.user as Record<string, unknown> | undefined;
                  const studentName = String(student?.name ?? p.studentName ?? "Student");
                  const tutorName   = String(tutorUser?.name ?? tutor?.name ?? p.tutorName ?? "Tutor");
                  const rawStatus   = String(p.status ?? "PAID").toUpperCase();
                  const statusCfg   = STATUS_CFG[rawStatus] ?? STATUS_CFG.PAID;
                  const amount      = Number(p.amount ?? p.price ?? 0);

                  return (
                    <div
                      key={String(p.id ?? idx)}
                      className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[1.5fr_2fr_2fr_1.2fr_1fr] sm:items-center sm:gap-4"
                    >
                      {/* Date */}
                      <p className="text-xs text-muted-foreground">
                        {formatDate(String(p.createdAt ?? ""))}
                      </p>

                      {/* Student */}
                      <div className="flex items-center gap-2.5">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                          {studentName[0]?.toUpperCase() ?? "S"}
                        </div>
                        <p className="truncate text-sm font-semibold">{studentName}</p>
                      </div>

                      {/* Tutor */}
                      <p className="truncate text-sm text-muted-foreground">{tutorName}</p>

                      {/* Amount */}
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        +৳{amount.toFixed(0)}
                      </p>

                      {/* Status */}
                      <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.textColor}`}>
                        <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                        {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
