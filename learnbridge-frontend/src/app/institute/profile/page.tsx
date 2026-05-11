import DashPageHeader from "@/components/layout/DashPageHeader";
import { instituteService } from "@/services/institute.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InstituteProfilePage() {
  const profile = await instituteService.getProfile() as Record<string, unknown> | null;

  return (
    <div className="space-y-6">
      <DashPageHeader title="Profile" description="Your institute profile information." />
      <Card className="max-w-xl">
        <CardHeader><CardTitle>Institute Details</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          {[
            { label: "Name",        value: profile?.name },
            { label: "Description", value: profile?.description },
          ].map(({ label, value }) => value != null && (
            <div key={label} className="flex gap-3">
              <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
              <span className="font-medium">{String(value)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
