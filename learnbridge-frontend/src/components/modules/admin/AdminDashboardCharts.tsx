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
import { Line, Doughnut, Bar } from "react-chartjs-2";

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

interface AdminChartsProps {
  platformTrend?: { month: string; revenue: number; signups: number }[];
  roleDistribution?: { role: string; count: number }[];
  bookingDistribution?: { status: string; count: number }[];
}

export default function AdminDashboardCharts({
  platformTrend = [],
  roleDistribution = [],
  bookingDistribution = [],
}: AdminChartsProps) {
  const trendLabels = platformTrend.map((d) => d.month);
  const trendData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Platform Revenue ($)",
        data: platformTrend.map((d) => d.revenue),
        borderColor: "rgba(99,102,241,1)",
        backgroundColor: "rgba(99,102,241,0.1)",
        yAxisID: "y",
        tension: 0.4,
        fill: true,
      },
      {
        label: "New User Signups",
        data: platformTrend.map((d) => d.signups),
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.1)",
        yAxisID: "y1",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const roleColors = [
    "rgba(99,102,241,0.8)",
    "rgba(168,85,247,0.8)",
    "rgba(249,115,22,0.8)",
    "rgba(236,72,153,0.8)",
    "rgba(20,184,166,0.8)",
    "rgba(234,179,8,0.8)",
  ];

  const roleData = {
    labels: roleDistribution.map((d) => d.role),
    datasets: [{
      data: roleDistribution.map((d) => d.count),
      backgroundColor: roleColors,
      borderWidth: 1,
    }],
  };

  const bookingColors = [
    "rgba(99,102,241,0.8)",
    "rgba(34,197,94,0.8)",
    "rgba(234,179,8,0.8)",
    "rgba(239,68,68,0.8)",
  ];

  const bookingData = {
    labels: bookingDistribution.map((d) => d.status),
    datasets: [{
      label: "Bookings",
      data: bookingDistribution.map((d) => d.count),
      backgroundColor: bookingColors,
    }],
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 mt-6">
      <div className="lg:col-span-8 rounded-2xl border bg-card/50 backdrop-blur-sm p-5">
        <h3 className="font-semibold mb-4">Platform Performance Trend</h3>
        <div style={{ height: 400 }}>
          <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { position: "left" }, y1: { position: "right", grid: { drawOnChartArea: false } } } }} />
        </div>
      </div>
      <div className="lg:col-span-4 rounded-2xl border bg-card/50 backdrop-blur-sm p-5">
        <h3 className="font-semibold mb-4">User Role Distribution</h3>
        <div style={{ height: 400 }}>
          <Doughnut data={roleData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="lg:col-span-12 rounded-2xl border bg-card/50 backdrop-blur-sm p-5">
        <h3 className="font-semibold mb-4">Booking Status Overview</h3>
        <div style={{ height: 350 }}>
          <Bar data={bookingData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
