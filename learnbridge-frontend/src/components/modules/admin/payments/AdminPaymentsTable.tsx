import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types";

export default function AdminPaymentsTable({ payments }: { payments: Payment[] }) {
  if (!payments?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
        <p className="text-muted-foreground">No payments found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.user?.name ?? "—"}</TableCell>
            <TableCell>${(payment.amount ?? 0).toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {payment.courseId ? "Course" : "Booking"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={payment.status === "PAID" ? "default" : "secondary"}>
                {payment.status ?? "PENDING"}
              </Badge>
            </TableCell>
            <TableCell>
              {payment.createdAt
                ? new Date(payment.createdAt).toLocaleDateString()
                : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
