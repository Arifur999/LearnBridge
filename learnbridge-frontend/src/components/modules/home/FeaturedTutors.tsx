import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { courseService } from "@/services/course.service";
import SectionHeader from "./SectionHeader";
import { getInitials } from "@/lib/utils";

export default async function FeaturedTutors() {
  const tutors = await courseService.getPopularCourses(3);

  if (!tutors?.length) return null;

  return (
    <section className="py-20 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="Top Rated"
            title="Featured Tutors"
            description="Learn from our highest-rated and most in-demand educators."
            className="mb-0"
          />
          <Button variant="outline" asChild className="hidden sm:flex shrink-0">
            <Link href="/tutors">
              Browse All <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor: Record<string, unknown>) => {
            const id = tutor.id as string;
            const name = (tutor.title || tutor.name) as string;
            const bio = tutor.description as string;
            const category = tutor.category as string;
            const price = tutor.price as number | undefined;

            return (
              <Card
                key={id}
                className="group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="size-14">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                      Featured
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg leading-tight">{name}</h3>
                  {category && (
                    <p className="text-sm text-primary font-medium mt-0.5">{category}</p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {bio}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {price != null && (
                      <span className="text-sm font-semibold">
                        ${price}
                        <span className="font-normal text-muted-foreground">/hr</span>
                      </span>
                    )}
                    <Button asChild size="sm" className="ml-auto">
                      <Link href={`/tutors/${id}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/tutors">
              Browse All Tutors <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
