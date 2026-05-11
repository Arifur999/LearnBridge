import { cn } from "@/lib/utils";

interface DashPageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export default function DashPageHeader({
  title,
  description,
  className,
}: DashPageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  );
}
