"use client";

import * as React from "react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Booking { createdAt?: string; status?: string; }
interface User    { role?: string; }

function buildBookingTrend(bookings: Booking[], days: number) {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const day  = new Date(now);
    day.setDate(now.getDate() - (days - 1 - i));
    day.setHours(0, 0, 0, 0);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const inDay = bookings.filter((b) => {
      if (!b.createdAt) return false;
      const d = new Date(b.createdAt);
      return d >= day && d < next;
    });
    return {
      date:      day.toISOString().slice(0, 10),
      confirmed: inDay.filter((b) => String(b.status ?? "").toUpperCase() === "CONFIRMED").length,
      completed: inDay.filter((b) => String(b.status ?? "").toUpperCase() === "COMPLETED").length,
      cancelled: inDay.filter((b) => String(b.status ?? "").toUpperCase() === "CANCELLED").length,
    };
  });
}

function AreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const date = new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="rounded-xl border border-white/15 bg-zinc-800/95 px-4 py-3 text-xs shadow-2xl backdrop-blur-sm">
      <p className="mb-2 font-semibold text-white/70">{date}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize text-white/60">{p.dataKey}:</span>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-zinc-800/95 px-4 py-3 text-xs shadow-2xl backdrop-blur-sm">
      <p className="mb-2 font-semibold text-white/70">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

interface Props {
  bookings: Booking[];
  users: User[];
  completed: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  students: number;
  tutors: number;
  others: number;
}

const PIE_COLORS  = ["#6366f1", "#8b5cf6", "#94a3b8"];
const BAR_COLORS  = { completed: "#10b981", confirmed: "#6366f1", cancelled: "#ef4444", pending: "#f59e0b" };

export default function AdminAnalyticsCharts({
  bookings, users,
  completed, confirmed, cancelled, pending,
  students, tutors, others,
}: Props) {
  const [range, setRange] = React.useState("30d");
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const trendData = React.useMemo(() => buildBookingTrend(bookings, days), [bookings, days]);
  const desc = range === "7d" ? "last 7 days" : range === "30d" ? "last 30 days" : "last 3 months";

  /* bar data */
  const barData = [
    { name: "Completed", value: completed, fill: BAR_COLORS.completed },
    { name: "Confirmed", value: confirmed, fill: BAR_COLORS.confirmed },
    { name: "Cancelled", value: cancelled, fill: BAR_COLORS.cancelled },
    { name: "Pending",   value: pending,   fill: BAR_COLORS.pending   },
  ];

  /* pie data */
  const pieData = [
    { name: "Students", value: students },
    { name: "Tutors",   value: tutors   },
    { name: "Others",   value: others   },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">

      
      <Card className="overflow-hidden border-border/40 bg-zinc-950 shadow-2xl">
        <div className="h-[3px] w-full" style={{ background: "linear-gradient(to right,#6366f1,#10b981,#f59e0b)" }} />
        <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-white">Booking Trends</CardTitle>
            <CardDescription className="text-white/45">Session activity for the {desc}</CardDescription>
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[155px] rounded-xl border-white/20 bg-white/8 text-sm text-white [&>svg]:text-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-5 px-6 pt-5 pb-2">
            {[
              { color: "#6366f1", label: "Confirmed" },
              { color: "#10b981", label: "Completed" },
              { color: "#ef4444", label: "Cancelled" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: color }} />
                <span className="text-xs text-white/50">{label}</span>
              </div>
            ))}
          </div>
          <div className="h-[240px] w-full px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="aGradConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="aGradComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="aGradCanc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={32}
                  tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false}
                  tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
                <Tooltip content={<AreaTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
                <Area dataKey="confirmed" type="monotone" fill="url(#aGradConf)" stroke="#6366f1" strokeWidth={2}   stackId="a" />
                <Area dataKey="completed" type="monotone" fill="url(#aGradComp)" stroke="#10b981" strokeWidth={1.5} stackId="a" />
                <Area dataKey="cancelled" type="monotone" fill="url(#aGradCanc)" stroke="#ef4444" strokeWidth={1.5} stackId="a" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

        {/* Bar chart: booking breakdown */}
        <Card className="overflow-hidden border-border/40 bg-zinc-950 shadow-2xl">
          <div className="h-[3px] w-full" style={{ background: "linear-gradient(to right,#6366f1,#f59e0b)" }} />
          <CardHeader className="border-b border-white/10 py-5">
            <CardTitle className="text-white">Booking Breakdown</CardTitle>
            <CardDescription className="text-white/45">Sessions by status</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[220px] w-full px-2 pb-4 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }} barSize={36}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart: user distribution */}
        <Card className="overflow-hidden border-border/40 bg-zinc-950 shadow-2xl">
          <div className="h-[3px] w-full" style={{ background: "linear-gradient(to right,#6366f1,#8b5cf6)" }} />
          <CardHeader className="border-b border-white/10 py-5">
            <CardTitle className="text-white">User Distribution</CardTitle>
            <CardDescription className="text-white/45">Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-4 pb-4">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.length > 0 ? pieData : [{ name: "No users", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    dataKey="value"
                    labelLine={false}
                    label={pieData.length > 0 ? PieLabel : undefined}
                  >
                    {(pieData.length > 0 ? pieData : [{ name: "No users", value: 1 }]).map((_, i) => (
                      <Cell key={i} fill={pieData.length > 0 ? PIE_COLORS[i % PIE_COLORS.length] : "#374151"} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    contentStyle={{ background: "rgba(24,24,27,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                    itemStyle={{ color: "rgba(255,255,255,0.8)" }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-xs text-white/60">{entry.name}</span>
                  <span className="text-xs font-bold text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
