"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { createReviewAction } from "@/actions/review.action";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  tutorId: string;
  tutorName: string;
  bookingId?: string;
}

export default function ReviewForm({ tutorId, tutorName, bookingId }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    startTransition(async () => {
      const res = await createReviewAction(tutorId, bookingId, rating, comment.trim());
      if (res.success) {
        toast.success("Review submitted!");
        setOpen(false);
        setRating(0);
        setComment("");
      } else {
        toast.error(res.message ?? "Failed to submit review");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 text-amber-600 hover:border-amber-400 hover:text-amber-700">
          <MessageSquare className="size-3.5" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review {tutorName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label className="mb-2 block">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`size-8 transition-colors ${
                      s <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="review-comment" className="mb-2 block">
              Comment
            </Label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this tutor..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full gap-2"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
