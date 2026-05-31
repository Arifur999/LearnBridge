"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  UserPlus, Loader2, Mail, User, ShieldCheck,
  CheckCircle2, BookOpen, Flag, MessageSquare,
  ArrowRight, Send, KeyRound, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inviteModeratorAction } from "@/actions/admin.action";

const CAPABILITIES = [
  {
    icon: BookOpen,
    label: "Course Review",
    desc: "Approve or reject tutor-submitted courses before they go live",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Flag,
    label: "Content Moderation",
    desc: "Flag and remove inappropriate content or reviews",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: MessageSquare,
    label: "Review Management",
    desc: "Manage student and tutor reviews on the platform",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: CheckCircle2,
    label: "Quality Control",
    desc: "Ensure platform standards are upheld across all content",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const STEPS = [
  { icon: Send,     label: "Send Invite",     desc: "Enter the email and click Send Invitation" },
  { icon: Mail,     label: "Email Delivered", desc: "Invitee receives an activation email"       },
  { icon: KeyRound, label: "Set Password",    desc: "They click the link and set their password" },
  { icon: Sparkles, label: "Active",          desc: "Account is activated with moderator access" },
];

export default function AdminModeratorsPage() {
  const [email, setEmail] = useState("");
  const [name,  setName]  = useState("");
  const [isPending, startTransition] = useTransition();

  const handleInvite = () => {
    const trimmedEmail = email.trim();
    const trimmedName  = name.trim();
    if (!trimmedEmail) { toast.error("Email is required"); return; }

    startTransition(async () => {
      const res = await inviteModeratorAction(trimmedEmail, trimmedName || undefined);
      if (res.success) {
        toast.success(`Invitation sent to ${trimmedEmail}`);
        setEmail("");
        setName("");
      } else {
        toast.error(res.message ?? "Failed to send invitation");
      }
    });
  };

  return (
    <div className="space-y-6">

      
      <div>
        <h1 className="text-2xl font-black tracking-tight">Moderators</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite trusted users to help moderate platform content
        </p>
      </div>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-indigo-500" />
        <CardContent className="flex flex-wrap items-center gap-5 p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-base">Moderator Role</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Moderators have elevated permissions to review courses, manage content, and maintain platform quality — without full admin access.
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            Trusted Role
          </span>
        </CardContent>
      </Card>

      
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">

        {/* Left: Invite Form */}
        <div>
          <Card className="overflow-hidden sticky top-4">
            <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />

            {/* Form header */}
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                  <UserPlus className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Invite a Moderator</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    They&apos;ll receive an email to activate their account
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-6">

              {/* Name field */}
              <div className="space-y-2">
                <Label htmlFor="mod-name" className="flex items-center gap-2 text-sm font-semibold">
                  <div className="flex size-5 items-center justify-center rounded-md bg-muted">
                    <User className="size-3 text-muted-foreground" />
                  </div>
                  Name
                  <span className="font-normal text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="mod-name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  className="rounded-xl h-11"
                />
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="mod-email" className="flex items-center gap-2 text-sm font-semibold">
                  <div className="flex size-5 items-center justify-center rounded-md bg-muted">
                    <Mail className="size-3 text-muted-foreground" />
                  </div>
                  Email Address
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <Input
                  id="mod-email"
                  type="email"
                  placeholder="moderator@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  disabled={isPending}
                  className="rounded-xl h-11"
                />
              </div>

              {/* Submit button */}
              <Button
                onClick={handleInvite}
                disabled={isPending || !email.trim()}
                className="w-full h-11 gap-2 rounded-xl text-sm font-semibold"
              >
                {isPending
                  ? <><Loader2 className="size-4 animate-spin" /> Sending Invitation…</>
                  : <><UserPlus className="size-4" /> Send Invitation</>
                }
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">what happens next</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Mini flow */}
              <div className="space-y-2.5">
                {[
                  { icon: Mail,     text: "Activation email sent to their inbox"          },
                  { icon: KeyRound, text: "They click the link and create a password"      },
                  { icon: Sparkles, text: "Moderator access is granted immediately"        },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-3.5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right: Capabilities + Steps */}
        <div className="space-y-6">

          {/* Capabilities */}
          <Card className="overflow-hidden">
            <div className="h-[3px] w-full bg-linear-to-r from-violet-500 to-primary" />
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                  <ShieldCheck className="size-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Moderator Capabilities</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">What moderators can do on the platform</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {CAPABILITIES.map(({ icon: Icon, label, desc, iconBg, iconColor }) => (
                <div key={label} className="flex items-start gap-4 border-b p-4 last:border-0 transition-colors hover:bg-muted/30">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="overflow-hidden">
            <div className="h-[3px] w-full bg-linear-to-r from-emerald-500 to-cyan-500" />
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <ArrowRight className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">How It Works</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">Invitation activation flow</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="relative space-y-0">
                {STEPS.map(({ icon: Icon, label, desc }, i) => (
                  <div key={label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">
                        {i + 1}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="mt-1 mb-1 w-px flex-1 bg-border min-h-[20px]" />
                      )}
                    </div>
                    <div className={`pb-5 min-w-0 ${i === STEPS.length - 1 ? "pb-0" : ""}`}>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-primary shrink-0" />
                        <p className="text-sm font-semibold">{label}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
