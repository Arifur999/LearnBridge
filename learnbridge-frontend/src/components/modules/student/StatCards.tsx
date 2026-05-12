import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, DollarSign, Star } from "lucide-react";

interface StudentStatCardsProps {
  stats: {
    totalEnrolledCourses?: number;
    totalBookings?: number;
    totalSpent?: number;
    totalReviews?: number;
  };
}

export default function StudentStatCards({ stats }: StudentStatCardsProps) {
  const statItems = [
    {
      title: "Enrolled Courses",
      value: stats.totalEnrolledCourses ?? 0,
      icon: BookOpen,
      description: "Active learning programs",
      color: "text-indigo-500",
    },
    {
      title: "Tutoring Sessions",
      value: stats.totalBookings ?? 0,
      icon: Clock,
      description: "1-on-1 sessions",
      color: "text-blue-500",
    },
    {
      title: "Total Investment",
      value: `$${((stats.totalSpent ?? 0)).toLocaleString()}`,
      icon: DollarSign,
      description: "Learning expenditures",
      color: "text-emerald-500",
    },
    {
      title: "Reviews Given",
      value: stats.totalReviews ?? 0,
      icon: Star,
      description: "Tutor feedback",
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/70">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-background shadow-sm ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black tracking-tight">{item.value}</div>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium opacity-80">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
