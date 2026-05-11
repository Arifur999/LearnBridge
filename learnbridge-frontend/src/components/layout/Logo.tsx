import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imgClassName?: string;
  textClassName?: string;
}

export default function Logo({
  className = "",
  imgClassName = "",
  textClassName = "",
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="LearnBridge"
        width={32}
        height={32}
        className={cn("size-8 object-contain dark:invert", imgClassName)}
      />
      <span
        className={cn(
          "text-xl font-bold text-primary tracking-wide",
          textClassName
        )}
      >
        LearnBridge
      </span>
    </Link>
  );
}
