"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateUserStatusAction } from "@/actions/admin.action";
import { User } from "@/types";

interface UsersTableProps {
  users: User[];
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function UsersTable({ users }: UsersTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (userId: string, status: string) => {
    setLoadingId(userId);
    const toastId = toast.loading("Updating status...");
    try {
      const res = await updateUserStatusAction(status, userId);
      if (res?.error) {
        toast.error(String(res.error), { id: toastId });
      } else {
        toast.success("Status updated", { id: toastId });
      }
    } catch {
      toast.error("Failed to update status", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  if (!users?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
        <p className="text-muted-foreground">No users found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="font-medium truncate max-w-[120px]">{user.name}</span>
              </div>
            </TableCell>
            <TableCell className="truncate max-w-[160px]">{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">{user.role?.toLowerCase()}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.status === "BANNED" ? "destructive" : "default"}>
                {user.status ?? "ACTIVE"}
              </Badge>
            </TableCell>
            <TableCell>
              <Select
                defaultValue={user.status ?? "ACTIVE"}
                disabled={loadingId === user.id}
                onValueChange={(val) => handleStatusChange(user.id, val)}
              >
                <SelectTrigger className="h-8 w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
