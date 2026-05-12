import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TutorPayment {
  id: string;
  amount: number;
  status?: string;
  createdAt?: string;
  student?: { name?: string };
  booking?: { id: string };
}

export default function TutorPaymentsTable({ payments }: { payments: TutorPayment[] }) {
  if (!payments?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
        <p className="text-muted-foreground">No payments yet.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.student?.name ?? "—"}</TableCell>
            <TableCell>${(payment.amount ?? 0).toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={payment.status === "PAID" ? "default" : "secondary"}>
                {payment.status ?? "PENDING"}
              </Badge>
            </TableCell>
            <TableCell>
              {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
