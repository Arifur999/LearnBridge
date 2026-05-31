import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpenCheck, Calendar, Clock, DollarSign,
  User, Mail, Hash, CheckCircle2, GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime, formatDay, formatDate } from "@/lib/utils";
import { getAuthHeaders } from "@/services/auth.server";
import { API_V1_URL } from "@/lib/config";

async function getBooking(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/bookings/${id}`, { headers, cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? data ?? null;
  } catch { return null; }
}

const STATUS_CFG: Record<string, { label: string; bg: string; textColor: string; dot: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100 dark:bg-blue-900/30",       textColor: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500"    },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500 animate-pulse" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",         textColor: "text-red-700 dark:text-red-400",         dot: "bg-red-500"     },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",     textColor: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500"   },
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-5 py-3.5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Icon className="size-4" />
        {label}
      </span>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id) as Record<string, unknown> | null;
  if (!booking) notFound();

  const avail    = booking?.availability as Record<string, unknown> | undefined;
  const tutor    = booking?.tutor        as Record<string, unknown> | undefined;
  const tutorUser = tutor?.user          as Record<string, unknown> | undefined;
  const student  = booking?.student      as Record<string, unknown> | undefined;
  const rawStatus = String(booking?.status ?? "").toUpperCase();
  const statusCfg = STATUS_CFG[rawStatus] ?? STATUS_CFG.CONFIRMED;

  const studentName = String(student?.name ?? "Student");
  const tutorName   = String(tutorUser?.name ?? tutor?.name ?? "Tutor");

  return (
    <div className="space-y-6">

      
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to All Bookings
      </Link>

      
      <Card className="overflow-hidden">
        <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-black text-primary">
              {studentName[0]?.toUpperCase() ?? "S"}
            </div>
            <div>
              <p className="text-lg font-black">{studentName}</p>
              {Boolean(student?.email) && (
                <p className="text-sm text-muted-foreground">{String(student?.email)}</p>
              )}
              <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.textColor}`}>
                <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Booking ID</p>
            <p className="font-mono text-sm font-semibold text-muted-foreground">#{id.slice(-8).toUpperCase()}</p>
          </div>
        </CardContent>
      </Card>

      
      <div className="grid gap-6 md:grid-cols-2">

        {/* Session Info */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <BookOpenCheck className="size-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Session Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <InfoRow icon={Hash}        label="Booking ID" value={`#${id.slice(-8).toUpperCase()}`} />
            {avail?.day      != null && <InfoRow icon={Calendar}    label="Day"       value={formatDay(String(avail.day))} />}
            {avail?.startTime != null && (
              <InfoRow
                icon={Clock}
                label="Time"
                value={`${formatTime(String(avail.startTime))}${avail.endTime != null ? ` – ${formatTime(String(avail.endTime))}` : ""}`}
              />
            )}
            {booking?.price  != null && <InfoRow icon={DollarSign}  label="Price"     value={`৳${String(booking.price)}`} />}
            {booking?.completedAt != null && (
              <InfoRow icon={CheckCircle2} label="Completed" value={formatDate(String(booking.completedAt))} />
            )}
          </CardContent>
        </Card>

        {/* People */}
        <div className="space-y-6">

          {/* Student */}
          <Card className="overflow-hidden">
            <div className="h-[3px] w-full bg-linear-to-r from-blue-500 to-cyan-500" />
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <User className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-base font-semibold">Student</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {student?.name  != null && <InfoRow icon={User} label="Name"  value={String(student.name)} />}
              {student?.email != null && <InfoRow icon={Mail} label="Email" value={String(student.email)} />}
            </CardContent>
          </Card>

          {/* Tutor */}
          <Card className="overflow-hidden">
            <div className="h-[3px] w-full bg-linear-to-r from-violet-500 to-primary" />
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                  <GraduationCap className="size-4 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-base font-semibold">Tutor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {tutorUser?.name  != null && <InfoRow icon={User}       label="Name"       value={String(tutorUser.name)} />}
              {tutorUser?.email != null && <InfoRow icon={Mail}       label="Email"      value={String(tutorUser.email)} />}
              {tutor?.hourlyRate != null && <InfoRow icon={DollarSign} label="Hourly Rate" value={`৳${String(tutor.hourlyRate)}/hr`} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
