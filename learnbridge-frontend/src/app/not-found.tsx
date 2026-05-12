import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <BookOpen className="size-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="max-w-md text-muted-foreground">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 size-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tutors">
            <Search className="mr-2 size-4" />
            Browse Tutors
          </Link>
        </Button>
      </div>
    </div>
  );
}
