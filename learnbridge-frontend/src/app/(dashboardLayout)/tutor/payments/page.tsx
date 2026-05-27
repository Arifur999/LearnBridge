import { paymentService } from "@/services/payment.service";
import { formatDate } from "@/lib/utils";
import {
  TrendingUp, Receipt, Clock, CheckCircle2,
  XCircle, Wallet, Users, BadgeDollarSign, ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Payment = Record<string, unknown>;

function getStatusCfg(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
    case "SUCCESS":
    case "COMPLETED":
      return { icon: CheckCircle2, bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", label: "Paid" };
    case "PENDING":
      return { icon: Clock,        bg: "bg-amber-100 dark:bg-amber-900/30",     text: "text-amber-700 dark:text-amber-400",    dot: "bg-amber-500",   label: "Pending" };
    case "FAILED":
    case "CANCELLED":
      return { icon: XCircle,      bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-600 dark:text-red-400",        dot: "bg-red-500",     label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() };
    default:
      return { icon: Clock,        bg: "bg-muted",                              text: "text-muted-foreground",                 dot: "bg-border",      label: status };
  }
}

function formatAmount(amount: unknown): string {
  const num = parseFloat(String(amount ?? 0));
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
];

export default async function TutorPaymentsPage() {
  const payments = await paymentService.getTutorPayments();
  const list: Payment[] = Array.isArray(payments) ? payments : [];

  /* ── Derived stats ── */
  const totalEarnings = list.reduce((s, p) => {
    const status = String(p.status ?? "").toUpperCase();
    if (["PAID", "SUCCESS", "COMPLETED"].includes(status)) {
      return s + parseFloat(String(p.amount ?? p.price ?? 0));
    }
    return s;
  }, 0);

  const paidCount    = list.filter((p) => ["PAID", "SUCCESS", "COMPLETED"].includes(String(p.status ?? "").toUpperCase())).length;
  const pendingCount = list.filter((p) => String(p.status ?? "").toUpperCase() === "PENDING").length;
  const uniqueStudents = new Set(
    list.map((p) => {
      const student = p.student as Record<string, unknown> | undefined;
      return String(student?.id ?? student?._id ?? p.studentId ?? "");
    }).filter(Boolean)
  ).size;

  const lastPayment = list[0];

  const statCards = [
    {
      icon: Wallet,
      label: "Total Earnings",
      value: `৳${totalEarnings.toFixed(2)}`,
      sub: `${paidCount} paid session${paidCount !== 1 ? "s" : ""}`,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500",
      barW: "100%",
    },
    {
      icon: Receipt,
      label: "Transactions",
      value: list.length,
      sub: "All time",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      bar: "bg-primary",
      barW: "100%",
    },
    {
      icon: Users,
      label: "Students",
      value: uniqueStudents || list.length,
      sub: "Unique paying students",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      bar: "bg-violet-500",
      barW: "100%",
    },
    {
      icon: TrendingUp,
      label: "Last Payment",
      value: lastPayment ? `৳${formatAmount(lastPayment.amount ?? lastPayment.price)}` : "—",
      sub: lastPayment ? formatDate(String(lastPayment.createdAt ?? "")) : "No payments yet",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      bar: "bg-blue-500",
      barW: "100%",
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your earnings from completed sessions
        </p>
      </div>

      {/* ── Stats Card ─────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-primary to-violet-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-4">
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

      {/* ── Transactions List ──────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-[3px] w-full bg-linear-to-r from-emerald-500 via-primary to-violet-500" />

        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <BadgeDollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">All Transactions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {list.length} record{list.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {pendingCount > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <span className="size-1.5 rounded-full bg-amber-500" />
                {pendingCount} pending
              </span>
            )}
          </div>
        </CardHeader>

        {list.length === 0 ? (
          <CardContent className="py-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-muted">
                <Receipt className="size-9 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-base font-semibold">No earnings yet</p>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Payments will appear here once students complete sessions with you.
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-5 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <Wallet className="size-4" />
                Add availability to start earning
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {list.map((p, i) => {
                const student     = p?.student as Record<string, unknown> | undefined;
                const studentName = String(student?.name ?? p.studentName ?? "Student");
                const status      = String(p.status ?? "PAID");
                const cfg         = getStatusCfg(status);
                const StatusIcon  = cfg.icon;
                const amount      = formatAmount(p.amount ?? p.price);
                const date        = formatDate(String(p.createdAt ?? ""));

                return (
                  <div key={String(p.id ?? i)} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30">

                    {/* Index */}
                    <span className="hidden w-6 shrink-0 text-center text-xs font-mono text-muted-foreground sm:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Avatar */}
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                      {studentName[0]?.toUpperCase() ?? "S"}
                    </div>

                    {/* Student name */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{studentName}</p>
                      <p className="text-xs text-muted-foreground">{date}</p>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-1.5">
                      <ArrowUpRight className="size-3.5 text-emerald-500 shrink-0" />
                      <span className="text-base font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                        ৳{amount}
                      </span>
                    </div>

                    {/* Status badge */}
                    <span className={`hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                      <StatusIcon className="size-3.5" />
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
