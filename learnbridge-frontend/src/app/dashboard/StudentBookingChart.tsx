"use client";

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
  type ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface BookingRecord {
  createdAt?: string;
  status?: string;
}

interface Props {
  bookings: BookingRecord[];
}

const RANGES = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 3 months" },
  { value: "180", label: "Last 6 months" },
] as const;

type RangeValue = (typeof RANGES)[number]["value"];

function getDayBuckets(days: number) {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - 1 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function formatAxisLabel(date: Date, totalDays: number): string {
  if (totalDays <= 30) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function bucketByDay(bookings: BookingRecord[], buckets: Date[]) {
  return buckets.map((day) => {
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    return bookings.filter((b) => {
      if (!b.createdAt) return false;
      const d = new Date(b.createdAt);
      return d >= day && d < next;
    }).length;
  });
}

function makeGradient(
  ctx: CanvasRenderingContext2D,
  chartArea: { top: number; bottom: number }
) {
  const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  g.addColorStop(0, "rgba(99, 102, 241, 0.28)");
  g.addColorStop(1, "rgba(99, 102, 241, 0.01)");
  return g;
}

export default function StudentBookingChart({ bookings }: Props) {
  const [range, setRange] = useState<RangeValue>("90");
  const days = Number(range);

  const buckets = useMemo(() => getDayBuckets(days), [days]);
  const counts = useMemo(() => bucketByDay(bookings, buckets), [bookings, buckets]);

  const total = counts.reduce((s, v) => s + v, 0);

  // show every Nth label so x-axis isn't crowded
  const tickStep = days <= 30 ? 4 : days <= 90 ? 7 : 14;
  const labels = buckets.map((d, i) =>
    i % tickStep === 0 || i === buckets.length - 1 ? formatAxisLabel(d, days) : ""
  );

  const selectedLabel = RANGES.find((r) => r.value === range)?.label ?? "";

  const data = {
    labels,
    datasets: [
      {
        data: counts,
        fill: true,
        tension: 0.42,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        borderColor: "rgba(99, 102, 241, 0.9)",
        pointHoverBackgroundColor: "rgb(99, 102, 241)",
        pointHoverBorderColor: "#fff",
        backgroundColor: (ctx: ScriptableContext<"line">) => {
          const chart = ctx.chart;
          const { chartArea, ctx: c } = chart;
          if (!chartArea) return "rgba(99,102,241,0.15)";
          return makeGradient(c, chartArea);
        },
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
        titleColor: "#111827",
        bodyColor: "#6b7280",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          title: (items: TooltipItem<"line">[]) => {
            const idx = items[0]?.dataIndex ?? 0;
            return buckets[idx]?.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }) ?? "";
          },
          label: (item: TooltipItem<"line">) => {
            const n = item.parsed.y;
            return ` ${n} booking${n !== 1 ? "s" : ""}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
          stepSize: 1,
          precision: 0,
          maxTicksLimit: 5,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-0 space-y-0 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            Area Chart - Interactive
          </CardTitle>
          <CardDescription className="mt-1 text-sm">
            Showing total bookings for the {selectedLabel.toLowerCase()}
          </CardDescription>
        </div>

        <Select value={range} onValueChange={(v) => setRange(v as RangeValue)}>
          <SelectTrigger className="mt-3 h-8 w-[140px] rounded-lg text-xs sm:mt-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGES.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="text-xs">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-6 sm:px-6">
        {/* Total stat above chart */}
        <div className="mb-4 px-2">
          <p className="text-3xl font-bold tabular-nums">{total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            total bookings in this period
          </p>
        </div>

        <div className="h-[240px]">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
