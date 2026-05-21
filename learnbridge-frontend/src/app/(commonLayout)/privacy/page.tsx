import Link from "next/link";
import Image from "next/image";
import { Lock, Eye, Database, UserCheck, Bell, Shield } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: `We collect information you provide directly: your name, email address, password (hashed), and role (student or tutor) when you register. Tutors additionally provide a bio, subjects taught, hourly rate, and availability schedule. We also collect session-related data including booking records, payment amounts, and reviews submitted on the platform.`,
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: `Your information is used to provide and improve the SkillBridge service. Specifically, we use it to: authenticate your account, match students with tutors, process bookings, send session confirmation and notification emails, display your public tutor profile (for tutors), and calculate platform statistics. We do not use your data for advertising or sell it to third parties.`,
  },
  {
    icon: Lock,
    title: "Data Security",
    content: `We implement industry-standard security measures to protect your personal information. Passwords are hashed before storage and never transmitted in plain text. Access tokens use JWT with expiration. All data is transmitted over HTTPS. We perform regular security reviews and update our practices as needed. Despite these measures, no system is 100% secure — please use a strong, unique password.`,
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: `You have the right to access, update, or delete your personal information at any time. You can update your profile information from your dashboard. To request complete account deletion or a copy of your data, contact us at support@skillbridge.com. We will respond to all requests within 30 days. Students may delete reviews they have submitted; tutors may update their profile information freely.`,
  },
  {
    icon: Bell,
    title: "Cookies and Tracking",
    content: `SkillBridge uses essential cookies to maintain your login session (accessToken, authUser). These are required for the platform to function and cannot be disabled. We do not use advertising cookies or third-party tracking scripts. Session cookies expire after 7 days of inactivity. You can clear cookies at any time through your browser settings, though this will log you out.`,
  },
  {
    icon: Shield,
    title: "Children's Privacy",
    content: `SkillBridge is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided personal information, we will take steps to delete that information promptly. Parents or guardians who believe their child has provided us with personal information should contact us immediately.`,
  },
  {
    icon: Database,
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify users of significant changes by posting a notice on the platform. The date at the top of this policy indicates when it was last updated. Continued use of SkillBridge after changes constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20">
      {/* Hero Banner */}
      <div className="relative mb-16 min-h-[40vh] overflow-hidden rounded-2xl">
        <Image
          src="/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg"
          alt="Privacy Policy"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-violet-900/65" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Lock className="size-4" />
            Privacy
          </div>
          <h1 className="text-3xl font-extrabold drop-shadow-lg md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/85">
            Your privacy matters to us. Here&apos;s exactly how we handle your data.
          </p>
          <p className="mt-2 text-sm text-white/60">Last updated: January 2025</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-10 rounded-2xl border bg-blue-50 p-5 text-sm text-blue-800">
          <strong>Summary:</strong> We collect only what is necessary to run the platform. We do not sell your data or use it for advertising. You can request deletion of your account at any time by contacting{" "}
          <a href="mailto:support@skillbridge.com" className="underline">support@skillbridge.com</a>.
        </div>

        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="rounded-2xl border p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="inline-flex rounded-xl bg-violet-100 p-2">
                    <Icon className="size-5 text-violet-600" />
                  </div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border-2 border-violet-200 bg-violet-50 p-6 text-center">
          <h3 className="mb-2 font-semibold">Privacy concerns?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Reach out and we will address your concerns within 30 days.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Contact Us
            </Link>
            <Link
              href="/terms"
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
