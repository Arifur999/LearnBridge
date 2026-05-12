import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";

interface TutorCardProps {
  tutor: {
    id: string;
    bio?: string;
    hourlyRate?: number;
    avgRating?: number;
    totalReviews?: number;
    isFeatured?: boolean;
    category?: { name: string };
    subjects?: { subject?: { name: string } }[];
    user?: { name?: string; image?: string | null };
  };
}

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardContent className="pt-5 pb-5 px-5 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={tutor.user?.image ?? undefined} />
            <AvatarFallback>{tutor.user?.name?.charAt(0) ?? "T"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-semibold truncate">{tutor.user?.name ?? "Tutor"}</p>
              {tutor.isFeatured && <Badge className="text-[10px] py-0">Featured</Badge>}
            </div>
            {tutor.category && (
              <p className="text-sm text-muted-foreground">{tutor.category.name}</p>
            )}
          </div>
        </div>

        {tutor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{tutor.bio}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {tutor.subjects?.slice(0, 3).map((s, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {s.subject?.name ?? "Subject"}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <StarRating rating={tutor.avgRating ?? 0} />
            <p className="text-xs text-muted-foreground mt-0.5">
              {tutor.totalReviews ?? 0} review{(tutor.totalReviews ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            {tutor.hourlyRate != null && (
              <p className="font-semibold text-sm">${tutor.hourlyRate}<span className="font-normal text-muted-foreground">/hr</span></p>
            )}
          </div>
        </div>

        <Button asChild className="w-full" size="sm">
          <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
