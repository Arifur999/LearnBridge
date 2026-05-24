import { paymentService } from "@/services/payment.service";
import { formatDate } from "@/lib/utils";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Receipt,
  TrendingUp,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type Payment = Record<string, unknown>;

function getStatusCfg(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
    case "SUCCESS":
    case "COMPLETED":
      return {
        icon: CheckCircle2,
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
        label: "Paid",
      };
    case "PENDING":
      return {
        icon: Clock,
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
        label: "Pending",
      };
    case "FAILED":
    case "CANCELLED":
      return {
        icon: XCircle,
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        dot: "bg-red-500",
        label: status.charAt(0) + status.slice(1).toLowerCase(),
      };
    default:
      return {
        icon: Clock,
        bg: "bg-muted",
        text: "text-muted-foreground",
        dot: "bg-border",
        label: status,
      };
  }
}

function formatAmount(amount: unknown): string {
  const num = parseFloat(String(amount ?? 0));
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

export default async function StudentPaymentsPage() {
  const payments = await paymentService.getMyPayments();
  const list: Payment[] = Array.isArray(payments) ? payments : [];

  /* ── derived stats ── */
  const totalSpent = list.reduce((s, p) => {
    const status = String(p.status ?? "").toUpperCase();
    if (status === "PAID" || status === "SUCCESS" || status === "COMPLETED") {
      return s + parseFloat(String(p.amount ?? p.price ?? 0));
    }
    return s;
  }, 0);

  const paidCount = list.filter((p) => {
    const s = String(p.status ?? "").toUpperCase();
    return s === "PAID" || s === "SUCCESS" || s === "COMPLETED";
  }).length;

  const pendingCount = list.filter(
    (p) => String(p.status ?? "").toUpperCase() === "PENDING"
  ).length;

  const lastPayment = list[0];

  const statCards = [
    {
      icon: Wallet,
      label: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      sub: `${paidCount} successful payment${paidCount !== 1 ? "s" : ""}`,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      accent: "from-primary/5 to-transparent",
    },
    {
      icon: Receipt,
      label: "Transactions",
      value: list.length,
      sub: "All time",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      accent: "from-violet-500/5 to-transparent",
    },
    {
      icon: Clock,
      label: "Pending",
      value: pendingCount,
      sub: pendingCount > 0 ? "Awaiting confirmation" : "All clear",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      accent: "from-amber-500/5 to-transparent",
    },
    {
      icon: TrendingUp,
      label: "Last Payment",
      value: lastPayment ? `$${formatAmount(lastPayment.amount ?? lastPayment.price)}` : "—",
      sub: lastPayment ? formatDate(String(lastPayment.createdAt ?? "")) : "No payments yet",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      accent: "from-emerald-500/5 to-transparent",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Payment History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track all your transactions and billing activity
          </p>
        </div>
        <Link
          href="/courses"
          className="hidden items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:flex"
        >
          Browse courses
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* ── Stat cards ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, accent }) => (
          <Card key={label} className="overflow-hidden">
            <div className={`h-1 w-full bg-linear-to-r ${accent.replace("to-transparent", "to-primary/0")}`}
              style={{ background: undefined }}
            />
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div className={`flex size-10 items-center justify-center rounded-2xl ${iconBg}`}>
                  <Icon className={`size-5 ${iconColor}`} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black tabular-nums">{value}</p>
              <p className="mt-0.5 text-sm font-semibold">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Table / Empty ─────────────────────────────────────── */}
      <Card className="overflow-hidden">
        {/* accent bar */}
        <div className="h-[3px] w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />

        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">All Transactions</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {list.length} record{list.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <CreditCard className="size-4 text-primary" />
            </div>
          </div>
        </CardHeader>

        {list.length === 0 ? (
          /* ── Empty state ── */
          <CardContent className="py-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-muted">
                <Receipt className="size-9 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-base font-semibold">No payment records yet</p>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Your payment history will appear here once you book a session or enroll in a course.
                </p>
              </div>
              <Link
                href="/tutors"
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <CreditCard className="size-4" />
                Make your first booking
              </Link>
            </div>
          </CardContent>
        ) : (
          /* ── Table ── */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    #
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Description
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {list.map((p, i) => {
                  const status = String(p.status ?? "PAID");
                  const cfg = getStatusCfg(status);
                  const StatusIcon = cfg.icon;
                  const description = String(
                    p.description ?? p.type ?? "Session payment"
                  );
                  const amount = formatAmount(p.amount ?? p.price);
                  const date = formatDate(String(p.createdAt ?? ""));

                  return (
                    <tr
                      key={String(p.id ?? i)}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Row number */}
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-muted-foreground">{date}</td>

                      {/* Description */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <CreditCard className="size-3.5 text-primary" />
                          </div>
                          <span className="font-medium">{description}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <span className="text-base font-black tabular-nums">
                          ${amount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                        >
                          <StatusIcon className="size-3.5" />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
