"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingRecord {
  createdAt?: string;
  status?: string;
}
interface Props {
  bookings: BookingRecord[];
}

function buildChartData(bookings: BookingRecord[], days: number) {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(now);
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
      date: day.toISOString().slice(0, 10),
      confirmed: inDay.filter((b) => String(b.status ?? "").toUpperCase() === "CONFIRMED").length,
      pending:   inDay.filter((b) => String(b.status ?? "").toUpperCase() === "PENDING").length,
    };
  });
}

function CustomTooltip({ active, payload, label }: any) {
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

export default function StudentBookingChart({ bookings }: Props) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

  const chartData = React.useMemo(() => buildChartData(bookings, days), [bookings, days]);

  const descLabel =
    timeRange === "7d" ? "the last 7 days" :
    timeRange === "30d" ? "the last 30 days" : "the last 3 months";

  return (
    <Card className="overflow-hidden border-border/40 bg-zinc-950 shadow-2xl">
      {/* top accent */}
      <div className="h-[3px] w-full" style={{ background: "linear-gradient(to right,#6366f1,#8b5cf6,#06b6d4)" }} />

      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-white">Booking Activity</CardTitle>
          <CardDescription className="text-white/45">
            Showing total bookings for {descLabel}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[155px] rounded-xl border-white/20 bg-white/8 text-sm text-white backdrop-blur-sm sm:ml-auto [&>svg]:text-white/50">
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
        {/* Legend */}
        <div className="flex items-center gap-5 px-6 pt-5 pb-2">
          {[
            { color: "#6366f1", label: "Confirmed" },
            { color: "#8b5cf6", label: "Pending" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: color }} />
              <span className="text-xs text-white/50">{label}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[240px] w-full px-2 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gradConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={32}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={28}
                allowDecimals={false}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />

              <Area dataKey="pending"   type="monotone" fill="url(#gradPending)"   stroke="#8b5cf6" strokeWidth={1.5} stackId="a" />
              <Area dataKey="confirmed" type="monotone" fill="url(#gradConfirmed)" stroke="#6366f1" strokeWidth={2}   stackId="a" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
