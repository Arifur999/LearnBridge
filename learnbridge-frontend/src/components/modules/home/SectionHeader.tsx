import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export default function SectionHeader({
  label,
  title,
  description,
  className,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", centered && "flex flex-col text-center items-center", className)}>
      {label && (
        <span className={cn(
          "mb-4 inline-flex border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary",
          centered && "mx-auto"
        )}>
          {label}
        </span>
      )}
      <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg", centered && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
