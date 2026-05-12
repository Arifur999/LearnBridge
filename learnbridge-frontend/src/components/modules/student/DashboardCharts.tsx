"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StudentDashboardChartsProps {
  stats?: {
    spendingTrend?: { month: string; amount: number }[];
    serviceMix?: { courses: number; tutoring: number };
    categoryDistribution?: { name: string; count: number }[];
  };
}

export default function StudentDashboardCharts({ stats }: StudentDashboardChartsProps) {
  const trend = stats?.spendingTrend ?? [];
  const mix = stats?.serviceMix ?? { courses: 0, tutoring: 0 };
  const categories = stats?.categoryDistribution ?? [];

  const trendData = {
    labels: trend.map((d) => d.month),
    datasets: [{
      label: "Spending ($)",
      data: trend.map((d) => d.amount),
      borderColor: "rgba(99,102,241,1)",
      backgroundColor: "rgba(99,102,241,0.1)",
      tension: 0.4,
      fill: true,
    }],
  };

  const mixData = {
    labels: ["Courses", "Tutoring"],
    datasets: [{
      data: [mix.courses, mix.tutoring],
      backgroundColor: ["rgba(99,102,241,0.8)", "rgba(168,85,247,0.8)"],
      borderWidth: 1,
    }],
  };

  const catColors = [
    "rgba(34,197,94,0.8)",
    "rgba(99,102,241,0.8)",
    "rgba(249,115,22,0.8)",
    "rgba(236,72,153,0.8)",
    "rgba(239,68,68,0.8)",
  ];

  const catData = {
    labels: categories.map((c) => c.name),
    datasets: [{
      data: categories.map((c) => c.count),
      backgroundColor: catColors,
      borderWidth: 1,
    }],
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 mt-6">
      <div className="lg:col-span-6 rounded-2xl border bg-card/50 backdrop-blur-sm p-5">
        <h3 className="font-semibold mb-4">Learning Investment</h3>
        <div style={{ height: 300 }}>
          <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="lg:col-span-3 rounded-2xl border bg-card/50 backdrop-blur-sm p-5">
        <h3 className="font-semibold mb-4">Service Distribution</h3>
        <div style={{ height: 300 }}>
          <Doughnut data={mixData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="lg:col-span-3 rounded-2xl border bg-card/50 backdrop-blur-sm p-5">
        <h3 className="font-semibold mb-4">Interests by Category</h3>
        <div style={{ height: 300 }}>
          <Doughnut data={catData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
