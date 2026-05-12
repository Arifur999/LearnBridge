"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { leaveReviewAction } from "@/actions/student.action";

export default function LeaveReviewDialog({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) { toast.error("Please select a rating"); return; }
    if (!review.trim()) { toast.error("Please write a review"); return; }
    setLoading(true);
    const toastId = toast.loading("Submitting review...");
    try {
      await leaveReviewAction({ bookingId, rating, review });
      toast.success("Review submitted!", { id: toastId });
      setRating(0);
      setReview("");
      setOpen(false);
    } catch {
      toast.error("Failed to submit review", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Leave Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className="w-7 h-7"
                    fill={i <= (hoverRating || rating) ? "#facc15" : "transparent"}
                    stroke={i <= (hoverRating || rating) ? "#facc15" : "#d1d5db"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="review-text">Review</Label>
            <Textarea
              id="review-text"
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, 500))}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">{review.length}/500</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !rating || !review.trim()}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
