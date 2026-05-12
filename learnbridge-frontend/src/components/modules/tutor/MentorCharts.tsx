"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TutorChartsProps {
  earningsTrend?: { month: string; amount: number }[];
  bookingStatusDistribution?: { status: string; count: number }[];
}

export default function MentorCharts({
  earningsTrend = [],
  bookingStatusDistribution = [],
}: TutorChartsProps) {
  const earningsData = {
    labels: earningsTrend.map((d) => d.month),
    datasets: [{
      label: "Earnings ($)",
      data: earningsTrend.map((d) => d.amount),
      borderColor: "rgba(99,102,241,1)",
      backgroundColor: "rgba(99,102,241,0.1)",
      tension: 0.4,
      fill: true,
    }],
  };

  const bookingColors = [
    "rgba(99,102,241,0.8)",
    "rgba(34,197,94,0.8)",
    "rgba(234,179,8,0.8)",
    "rgba(239,68,68,0.8)",
  ];

  const bookingData = {
    labels: bookingStatusDistribution.map((d) => d.status),
    datasets: [{
      label: "Bookings",
      data: bookingStatusDistribution.map((d) => d.count),
      backgroundColor: bookingColors,
    }],
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-5">
        <h3 className="font-semibold mb-4">Earnings Trend</h3>
        <div style={{ height: 300 }}>
          <Line data={earningsData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-5">
        <h3 className="font-semibold mb-4">Booking Status</h3>
        <div style={{ height: 300 }}>
          <Bar data={bookingData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
