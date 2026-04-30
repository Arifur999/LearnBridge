import { updateTutorProfileAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TutorProfilePage() {
  async function saveProfile(formData: FormData) {
    "use server";
    await updateTutorProfileAction(formData);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tutor Profile</h1>
        <p className="text-muted-foreground">
          Keep your profile clear so students know what you teach.
        </p>
      </div>

      <form action={saveProfile} className="space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" placeholder="Programming, Math, English" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subjects">Subjects</Label>
          <Input
            id="subjects"
            name="subjects"
            placeholder="JavaScript, React, Algebra"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Session price</Label>
          <Input id="hourlyRate" name="hourlyRate" type="number" min="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" name="bio" placeholder="Short profile summary" />
        </div>
        <Button type="submit">Save Profile</Button>
      </form>
    </div>
  );
}
