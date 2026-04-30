import { getAdminUsers } from "@/actions/dashboard.action";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">View students and tutors on the platform.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        {users.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={text(user.id ?? user._id ?? user.email)}
              className="grid grid-cols-4 border-t p-3 text-sm"
            >
              <span>{text(user.name)}</span>
              <span className="truncate">{text(user.email)}</span>
              <span>{text(user.role)}</span>
              <span>{text(user.status, "active")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
