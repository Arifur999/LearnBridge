"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateUserStatusAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { ShieldBan, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";

interface Props {
  userId: string;
  isBanned: boolean;
}

export default function UserStatusToggle({ userId, isBanned: initialBanned }: Props) {
  const [banned, setBanned]       = useState(initialBanned);
  const [showDialog, setShowDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    const newStatus = banned ? "ACTIVE" : "BLOCKED";
    setShowDialog(false);
    startTransition(async () => {
      const res = await updateUserStatusAction(userId, newStatus);
      if (res.success) {
        setBanned(!banned);
        toast.success(banned ? "User has been unbanned." : "User has been banned.");
      } else {
        toast.error(res.message ?? "Failed to update status");
      }
    });
  };

  return (
    <>
      <Button
        size="sm"
        variant={banned ? "outline" : "destructive"}
        onClick={() => setShowDialog(true)}
        disabled={isPending}
        className={`gap-1.5 rounded-xl ${banned ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30" : ""}`}
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : banned ? (
          <ShieldCheck className="size-3.5" />
        ) : (
          <ShieldBan className="size-3.5" />
        )}
        {banned ? "Unban" : "Ban"}
      </Button>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDialog(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl">
            <div className={`h-1 w-full ${banned ? "bg-linear-to-r from-emerald-500 to-cyan-500" : "bg-linear-to-r from-red-500 to-rose-600"}`} />

            <div className="p-6">
              {/* Icon */}
              <div className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-3xl ${banned ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                {banned
                  ? <ShieldCheck className="size-7 text-emerald-600 dark:text-emerald-400" />
                  : <AlertTriangle className="size-7 text-red-600 dark:text-red-400" />
                }
              </div>

              {/* Title */}
              <h3 className="text-center text-base font-black tracking-tight">
                {banned ? "Unban this user?" : "Ban this user?"}
              </h3>
              <p className="mt-1.5 text-center text-sm text-muted-foreground">
                {banned
                  ? "The user will regain full access to the platform."
                  : "The user will lose access to the platform immediately."
                }
              </p>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className={`flex-1 gap-2 rounded-xl ${banned ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"} text-white`}
                  onClick={handleConfirm}
                >
                  {banned
                    ? <><ShieldCheck className="size-4" /> Confirm Unban</>
                    : <><ShieldBan className="size-4" /> Confirm Ban</>
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
