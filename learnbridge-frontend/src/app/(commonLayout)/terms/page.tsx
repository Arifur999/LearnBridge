import Link from "next/link";
import Image from "next/image";
import { FileText, ShieldCheck, AlertTriangle, BookOpen } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content: `By accessing or using SkillBridge, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. These terms apply to all users including students, tutors, and administrators.`,
  },
  {
    icon: BookOpen,
    title: "Use of the Platform",
    content: `SkillBridge is an online tutoring marketplace connecting students with qualified tutors. Students may browse tutor profiles, view availability, and book sessions. Tutors may create profiles, set availability, and manage bookings. All users must provide accurate information and maintain the security of their accounts. You are responsible for all activity that occurs under your account.`,
  },
  {
    icon: ShieldCheck,
    title: "Payments and Refunds",
    content: `All session fees are displayed in BDT (Bangladeshi Taka). Payments are processed at the time of booking confirmation. Cancellations made before the session are eligible for a full refund. No-shows or last-minute cancellations (less than 1 hour before the session) are non-refundable. SkillBridge does not charge any platform fee — the listed price is what you pay.`,
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Conduct",
    content: `You may not use SkillBridge for any unlawful purpose or in a way that violates these terms. Prohibited activities include: sharing false or misleading information, harassing other users, attempting to bypass our payment system, scraping or copying platform data, or using the platform to distribute spam or malicious content. Violations may result in immediate account suspension.`,
  },
  {
    icon: ShieldCheck,
    title: "Intellectual Property",
    content: `All content on SkillBridge — including the logo, design, text, and software — is the property of SkillBridge and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission. Tutors retain ownership of the materials they create for sessions.`,
  },
  {
    icon: FileText,
    title: "Limitation of Liability",
    content: `SkillBridge provides its platform on an "as is" basis. We do not guarantee uninterrupted access or error-free operation. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform. Our maximum liability to any user is limited to the amount paid for the specific session in question.`,
  },
  {
    icon: AlertTriangle,
    title: "Changes to Terms",
    content: `We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of SkillBridge after changes constitutes your acceptance of the new terms. We encourage you to review these terms periodically.`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20">
      {/* Hero Banner */}
      <div className="relative mb-16 min-h-[40vh] overflow-hidden rounded-2xl">
        <Image
          src="/education-learn-study-world-graduated-student-studying-abroad-international-idea_488220-56721.jpg"
          alt="Terms of Service"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-indigo-900/65" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <FileText className="size-4" />
            Legal
          </div>
          <h1 className="text-3xl font-extrabold drop-shadow-lg md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/85">
            Please read these terms carefully before using SkillBridge.
          </p>
          <p className="mt-2 text-sm text-white/60">Last updated: January 2025</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-10 rounded-2xl border bg-amber-50 p-5 text-sm text-amber-800">
          <strong>Summary:</strong> By using SkillBridge you agree to these terms. They cover how you use the platform, payments, prohibited behaviour, and our liability limits. If you have questions, contact us at{" "}
          <a href="mailto:support@skillbridge.com" className="underline">support@skillbridge.com</a>.
        </div>

        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="rounded-2xl border p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="inline-flex rounded-xl bg-primary/10 p-2">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
          <h3 className="mb-2 font-semibold">Questions about our Terms?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Contact our support team — we&apos;re happy to clarify anything.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
