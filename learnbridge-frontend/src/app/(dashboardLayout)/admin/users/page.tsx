import { getAdminUsers } from "@/actions/dashboard.action";
import UserStatusToggle from "./UserStatusToggle";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const roleBadge = (role: unknown) => {
  const r = text(role).toLowerCase();
  if (r === "admin") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (r === "trainer" || r === "tutor") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
  return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
};

const roleLabel = (role: unknown) => {
  const r = text(role).toLowerCase();
  if (r === "trainer") return "Tutor";
  return text(role);
};

const statusBadge = (status: unknown) => {
  const s = text(status, "active").toLowerCase();
  if (s === "blocked" || s === "banned") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
};

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  const total = users.length;
  const students = users.filter((u) => String(u.role ?? "").toLowerCase() === "student").length;
  const tutors = users.filter((u) => {
    const r = String(u.role ?? "").toLowerCase();
    return r === "tutor" || r === "trainer";
  }).length;
  const admins = users.filter((u) => String(u.role ?? "").toLowerCase() === "admin").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">All registered users on the platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Users", value: total, color: "bg-primary/10 text-primary" },
          { label: "Students", value: students, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
          { label: "Tutors", value: tutors, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
          { label: "Admins", value: admins, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border bg-background p-4 shadow-sm">
            <p className="text-2xl font-bold">{value}</p>
            <p className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Name</th>
              <th className="px-5 py-3 text-left font-semibold">Email</th>
              <th className="px-5 py-3 text-left font-semibold">Role</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Joined</th>
              <th className="px-5 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const userId = text(user.id ?? user._id ?? user.email);
                const currentStatus = text(user.status, "active");
                const isBanned = ["blocked", "banned"].includes(currentStatus.toLowerCase());
                const joined = user.createdAt
                  ? new Date(text(user.createdAt)).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                  : "—";

                return (
                  <tr key={userId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{text(user.name)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{text(user.email)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge(user.role)}`}>
                        {roleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(currentStatus)}`}>
                        {isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{joined}</td>
                    <td className="px-5 py-3">
                      <UserStatusToggle userId={userId} isBanned={isBanned} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
