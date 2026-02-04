"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { enrollCourseAction } from "@/actions/enrollment.action";
import type { UserRole } from "@/lib/nav.config";

interface EnrollButtonProps {
  courseId: string;
  userRole?: UserRole | null;
}

export function EnrollButton({ courseId, userRole }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!userRole) {
    return (
      <Button asChild className="w-full">
        <Link href="/login">Login to Enroll</Link>
      </Button>
    );
  }

  if (userRole !== "student") {
    return (
      <Button className="w-full" disabled>
        Only students can enroll
      </Button>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);

    const result = await enrollCourseAction(courseId);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <Button className="w-full" onClick={handleEnroll} disabled={loading}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : "Enroll Now"}
    </Button>
  );
}
