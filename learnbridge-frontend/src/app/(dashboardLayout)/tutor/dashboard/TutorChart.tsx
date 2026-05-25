"use client";

import * as React from "react";
import {
  Area, AreaChart, CartesianGrid,
  ResponsiveContainer, XAxis, YAxis, Tooltip,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Booking { createdAt?: string; status?: string; }

function buildData(bookings: Booking[], days: number) {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (days - 1 - i));
    day.setHours(0, 0, 0, 0);
    const next = new Date(day); next.setDate(day.getDate() + 1);
    const inDay = bookings.filter((b) => {
      if (!b.createdAt) return false;
      const d = new Date(b.createdAt);
      return d >= day && d < next;
    });
    return {
      date: day.toISOString().slice(0, 10),
      confirmed:  inDay.filter((b) => String(b.status ?? "").toUpperCase() === "CONFIRMED").length,
      completed:  inDay.filter((b) => String(b.status ?? "").toUpperCase() === "COMPLETED").length,
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

export default function TutorChart({ bookings }: { bookings: Booking[] }) {
  const [range, setRange] = React.useState("90d");
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const data = React.useMemo(() => buildData(bookings, days), [bookings, days]);
  const desc = range === "7d" ? "last 7 days" : range === "30d" ? "last 30 days" : "last 3 months";

  return (
    <Card className="overflow-hidden border-border/40 bg-zinc-950 shadow-2xl">
      <div className="h-[3px] w-full" style={{ background: "linear-gradient(to right,#6366f1,#10b981,#06b6d4)" }} />
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-white">Session Activity</CardTitle>
          <CardDescription className="text-white/45">Booking trends for the {desc}</CardDescription>
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
        <div className="flex items-center gap-5 px-6 pt-5 pb-2">
          {[{ color: "#6366f1", label: "Confirmed" }, { color: "#10b981", label: "Completed" }].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: color }} />
              <span className="text-xs text-white/50">{label}</span>
            </div>
          ))}
        </div>
        <div className="h-[240px] w-full px-2 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="tGradConf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="tGradComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={32}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
              <Area dataKey="confirmed" type="monotone" fill="url(#tGradConf)" stroke="#6366f1" strokeWidth={2}   stackId="a" />
              <Area dataKey="completed" type="monotone" fill="url(#tGradComp)" stroke="#10b981" strokeWidth={1.5} stackId="a" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
