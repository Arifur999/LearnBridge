"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateFeaturedTutorAction } from "@/actions/admin.action";
import { StarRating } from "@/components/ui/star-rating";

interface TutorRow {
  id: string;
  isFeatured: boolean;
  avgRating?: number;
  hourlyRate?: number;
  category?: { name: string };
  user?: { name: string; image?: string | null };
}

export default function FeaturedTutorsTable({ tutors }: { tutors: TutorRow[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (tutorId: string, current: boolean) => {
    setLoadingId(tutorId);
    const toastId = toast.loading("Updating...");
    try {
      const res = await updateFeaturedTutorAction(!current, tutorId);
      if (res?.error) {
        toast.error(String(res.error), { id: toastId });
      } else {
        toast.success(current ? "Removed from featured" : "Added to featured", { id: toastId });
      }
    } catch {
      toast.error("Failed to update", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  if (!tutors?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
        <p className="text-muted-foreground">No tutors found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tutor</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Rate/hr</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tutors.map((tutor) => (
          <TableRow key={tutor.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={tutor.user?.image ?? undefined} />
                  <AvatarFallback>{tutor.user?.name?.charAt(0) ?? "T"}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{tutor.user?.name ?? "—"}</span>
              </div>
            </TableCell>
            <TableCell>{tutor.category?.name ?? "—"}</TableCell>
            <TableCell>
              <StarRating rating={tutor.avgRating ?? 0} />
            </TableCell>
            <TableCell>{tutor.hourlyRate != null ? `$${tutor.hourlyRate}/hr` : "—"}</TableCell>
            <TableCell>
              <Badge variant={tutor.isFeatured ? "default" : "outline"}>
                {tutor.isFeatured ? "Featured" : "Not Featured"}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                disabled={loadingId === tutor.id}
                onClick={() => handleToggle(tutor.id, tutor.isFeatured)}
              >
                {tutor.isFeatured ? "Remove" : "Feature"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
