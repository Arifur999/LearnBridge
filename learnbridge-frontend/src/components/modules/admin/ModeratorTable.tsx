import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Moderator {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  status?: string;
  createdAt?: string;
}

export default function ModeratorTable({ moderators }: { moderators: Moderator[] }) {
  if (!moderators?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
        <p className="text-muted-foreground">No moderators found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Moderator</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {moderators.map((mod) => (
          <TableRow key={mod.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mod.image} />
                  <AvatarFallback>{mod.name?.charAt(0) ?? "M"}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{mod.name ?? "—"}</span>
              </div>
            </TableCell>
            <TableCell>{mod.email ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={mod.status === "BANNED" ? "destructive" : "default"}>
                {mod.status ?? "ACTIVE"}
              </Badge>
            </TableCell>
            <TableCell>
              {mod.createdAt ? new Date(mod.createdAt).toLocaleDateString() : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
