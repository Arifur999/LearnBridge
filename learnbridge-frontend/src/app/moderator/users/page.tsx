import DashPageHeader from "@/components/layout/DashPageHeader";
import { getAdminUsers } from "@/actions/dashboard.action";
import UserStatusToggle from "@/app/(dashboardLayout)/admin/users/UserStatusToggle";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const roleBadgeClass = (role: unknown) => {
  const r = text(role).toLowerCase();
  if (r === "admin") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (r === "tutor" || r === "trainer") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
  if (r === "moderator") return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
  return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
};

const statusBadgeClass = (status: unknown) => {
  const s = text(status, "active").toLowerCase();
  if (s === "blocked") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
};

export default async function ModeratorUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <DashPageHeader title="User Access Control" description="Review and manage user access on the platform." />

      <div className="overflow-hidden rounded-2xl border">
        <div className="hidden grid-cols-5 bg-muted px-5 py-3 text-sm font-semibold md:grid">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {users.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No users found.</p>
        ) : (
          <div className="divide-y">
            {users.map((user) => {
              const userId = text(user.id ?? user._id ?? user.email);
              const currentStatus = text(user.status, "active");
              const isBanned = currentStatus.toLowerCase() === "blocked";
              return (
                <div
                  key={userId}
                  className="grid grid-cols-2 items-center gap-3 px-5 py-4 text-sm md:grid-cols-5"
                >
                  <span className="font-medium">{text(user.name)}</span>
                  <span className="truncate text-muted-foreground">{text(user.email)}</span>
                  <span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(user.role)}`}>
                      {text(user.role)}
                    </span>
                  </span>
                  <span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(currentStatus)}`}>
                      {isBanned ? "Banned" : "Active"}
                    </span>
                  </span>
                  <UserStatusToggle userId={userId} isBanned={isBanned} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
