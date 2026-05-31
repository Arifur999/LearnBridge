import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Calendar, Clock, DollarSign,
  User, Mail, BookOpen, CheckCircle2,
  XCircle, AlertCircle, Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime, formatDay, formatDate } from "@/lib/utils";
import { getAuthHeaders } from "@/services/auth.server";
import { API_V1_URL } from "@/lib/config";
import CompleteBookingButton from "../../dashboard/CompleteBookingButton";

async function getBooking(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/bookings/${id}`, { headers, cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? data ?? null;
  } catch { return null; }
}

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100 dark:bg-blue-900/30",       text: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500",     border: "border-blue-200 dark:border-blue-800"     },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500",  border: "border-emerald-200 dark:border-emerald-800" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-600 dark:text-red-400",         dot: "bg-red-500",      border: "border-red-200 dark:border-red-800"         },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",     text: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500",    border: "border-amber-200 dark:border-amber-800"     },
};

function InfoRow({ icon: Icon, iconBg, iconColor, label, value }: {
  icon: React.ElementType; iconBg: string; iconColor: string; label: string; value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`flex size-8 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`size-3.5 ${iconColor}`} />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-right text-sm font-semibold">{value}</div>
    </div>
  );
}

export default async function TutorBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBooking(id) as Record<string, unknown> | null;
  if (!booking) notFound();

  const avail   = booking?.availability as Record<string, unknown> | undefined;
  const student = booking?.student   as Record<string, unknown> | undefined;
  const subject = booking?.subject   as Record<string, unknown> | undefined;
  const status  = String(booking?.status ?? "PENDING").toUpperCase();
  const cfg     = STATUS_CFG[status] ?? STATUS_CFG.PENDING;
  const isConfirmed = status === "CONFIRMED";

  const studentName = String(student?.name ?? "Unknown Student");

  return (
    <div className="space-y-6">

      
      <Button asChild variant="ghost" size="sm" className="gap-2 rounded-xl">
        <Link href="/tutor/bookings">
          <ArrowLeft className="size-4" /> Back to Bookings
        </Link>
      </Button>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: student avatar + name */}
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-black text-primary">
                {studentName[0]?.toUpperCase() ?? "S"}
              </div>
              <div>
                <p className="text-lg font-black">{studentName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Student</p>
              </div>
            </div>

            {/* Right: status + action */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                <span className={`size-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
              {isConfirmed && <CompleteBookingButton bookingId={id} />}
            </div>
          </div>
        </CardContent>
      </Card>

      
      <div className="grid gap-5 md:grid-cols-2">

        {/* Session Info */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="size-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Session Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="divide-y px-5 py-0">
            <InfoRow
              icon={Hash}
              iconBg="bg-muted"
              iconColor="text-muted-foreground"
              label="Booking ID"
              value={<span className="font-mono text-xs text-muted-foreground">{id}</span>}
            />
            {avail?.day != null && (
              <InfoRow
                icon={Calendar}
                iconBg="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-blue-600 dark:text-blue-400"
                label="Day"
                value={formatDay(String(avail.day))}
              />
            )}
            {avail?.startTime != null && (
              <InfoRow
                icon={Clock}
                iconBg="bg-violet-100 dark:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400"
                label="Time"
                value={`${formatTime(String(avail.startTime))}${avail.endTime != null ? ` – ${formatTime(String(avail.endTime))}` : ""}`}
              />
            )}
            {booking?.price != null && (
              <InfoRow
                icon={DollarSign}
                iconBg="bg-emerald-100 dark:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400"
                label="Price"
                value={<span className="text-emerald-600 dark:text-emerald-400">৳{String(booking.price)}</span>}
              />
            )}
            {subject?.name != null && (
              <InfoRow
                icon={BookOpen}
                iconBg="bg-amber-100 dark:bg-amber-900/30"
                iconColor="text-amber-600 dark:text-amber-400"
                label="Subject"
                value={String(subject.name)}
              />
            )}
            {booking?.completedAt != null && (
              <InfoRow
                icon={CheckCircle2}
                iconBg="bg-emerald-100 dark:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400"
                label="Completed At"
                value={formatDate(String(booking.completedAt))}
              />
            )}
          </CardContent>
        </Card>

        {/* Student Info */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-emerald-500 to-cyan-500" />
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <User className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-base font-semibold">Student Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="divide-y px-5 py-0">
            {student?.name != null && (
              <InfoRow
                icon={User}
                iconBg="bg-primary/10"
                iconColor="text-primary"
                label="Full Name"
                value={String(student.name)}
              />
            )}
            {student?.email != null && (
              <InfoRow
                icon={Mail}
                iconBg="bg-violet-100 dark:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400"
                label="Email"
                value={<span className="text-xs">{String(student.email)}</span>}
              />
            )}
            {/* Status summary */}
            <div className="py-4">
              <div className={`flex items-center gap-3 rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}>
                <span className={`size-3 rounded-full ${cfg.dot}`} />
                <div>
                  <p className={`text-sm font-bold ${cfg.text}`}>Session {cfg.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {status === "CONFIRMED" && "Awaiting session completion"}
                    {status === "COMPLETED" && "This session has been completed"}
                    {status === "CANCELLED" && "This session was cancelled"}
                    {status === "PENDING"   && "Awaiting confirmation"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
