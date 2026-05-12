"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createCoursePaymentAction } from "@/actions/payment.action";

export default function CourseEnrollButton({ courseId, price }: { courseId: string; price: number }) {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    const toastId = toast.loading(price === 0 ? "Enrolling..." : "Initiating payment...");
    try {
      const res = await createCoursePaymentAction(courseId);
      const url = res?.data?.url ?? res?.url;
      if (url) {
        toast.success("Redirecting...", { id: toastId });
        window.location.href = url;
      } else {
        toast.success("Enrolled successfully!", { id: toastId });
      }
    } catch {
      toast.error("Enrollment failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleEnroll} disabled={loading} className="w-full" size="lg">
      {loading ? "Processing..." : price === 0 ? "Enroll for Free" : `Enroll — $${price}`}
    </Button>
  );
}
