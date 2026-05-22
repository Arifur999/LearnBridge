"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface BookingRecord {
  createdAt?: string;
  status?: string;
}

interface Props {
  bookings: BookingRecord[];
}

const SERIES = [
  { key: "all", label: "Total Sessions" },
  { key: "completed", label: "Completed" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

const RANGES = [
  { key: 3, label: "3 months" },
  { key: 6, label: "6 months" },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

function getMonthBuckets(monthCount: number) {
  const buckets: { label: string; year: number; month: number }[] = [];
  const now = new Date();
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      label: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return buckets;
}

function bucketBookings(
  bookings: BookingRecord[],
  buckets: { year: number; month: number }[],
  filterCompleted: boolean
) {
  return buckets.map(({ year, month }) =>
    bookings.filter((b) => {
      if (!b.createdAt) return false;
      const d = new Date(b.createdAt);
      const matchMonth = d.getFullYear() === year && d.getMonth() === month;
      if (!matchMonth) return false;
      if (filterCompleted) return String(b.status ?? "").toUpperCase() === "COMPLETED";
      return true;
    }).length
  );
}

export default function StudentBookingChart({ bookings }: Props) {
  const [activeSeries, setActiveSeries] = useState<SeriesKey>("all");
  const [range, setRange] = useState<RangeKey>(6);
  const [primaryColor, setPrimaryColor] = useState("59 130 246");
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const raw = getComputedStyle(root).getPropertyValue("--primary").trim();
    if (raw) setPrimaryColor(raw);
  }, []);

  const buckets = useMemo(() => getMonthBuckets(range), [range]);
  const labels = buckets.map((b) => b.label);

  const allData = useMemo(
    () => bucketBookings(bookings, buckets, false),
    [bookings, buckets]
  );
  const completedData = useMemo(
    () => bucketBookings(bookings, buckets, true),
    [bookings, buckets]
  );

  const activeData = activeSeries === "completed" ? completedData : allData;
  const total = activeData.reduce((s, v) => s + v, 0);
  const avg = buckets.length ? (total / buckets.length).toFixed(1) : "0";

  const buildGradient = (ctx: CanvasRenderingContext2D, chartArea: { top: number; bottom: number }) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, `oklch(${primaryColor} / 0.35)`);
    gradient.addColorStop(1, `oklch(${primaryColor} / 0.02)`);
    return gradient;
  };

  const data = {
    labels,
    datasets: [
      {
        data: activeData,
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        borderWidth: 2,
        borderColor: `oklch(${primaryColor})`,
        pointBackgroundColor: `oklch(${primaryColor})`,
        pointBorderColor: "white",
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const chart = ctx.chart;
          const { chartArea, ctx: canvasCtx } = chart;
          if (!chartArea) return "transparent";
          return buildGradient(canvasCtx, chartArea);
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
        backgroundColor: "hsl(var(--background, 0 0% 100%))",
        borderColor: "hsl(var(--border, 214 32% 91%))",
        borderWidth: 1,
        titleColor: "hsl(var(--foreground, 222 84% 5%))",
        bodyColor: "hsl(var(--muted-foreground, 215 20% 45%))",
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          title: (items: TooltipItem<"line">[]) =>
            items[0]?.label ?? "",
          label: (item: TooltipItem<"line">) =>
            ` ${item.parsed.y} ${activeSeries === "completed" ? "completed" : "session"}${item.parsed.y !== 1 ? "s" : ""}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "hsl(215 20% 55%)",
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(214 32% 91% / 0.5)",
        },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: "hsl(215 20% 55%)",
          font: { size: 12 },
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Booking Activity</CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Your session history over the last {range} months
            </CardDescription>
          </div>

          {/* Range toggle */}
          <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
            {RANGES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  range === key
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Series toggle + stat */}
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div className="flex gap-2">
            {SERIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSeries(key)}
                className={`rounded-full border px-3.5 py-1 text-xs font-medium transition-all ${
                  activeSeries === key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">{total}</p>
            <p className="text-xs text-muted-foreground">{avg} / month avg</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[220px]">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
