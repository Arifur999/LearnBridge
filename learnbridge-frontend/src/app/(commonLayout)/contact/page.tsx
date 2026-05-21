import Image from "next/image";
import { BookOpen, Clock, GraduationCap, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@learnbridge.com",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/45 dark:text-indigo-300",
  },
  {
    icon: BookOpen,
    label: "Student Help",
    value: "Bookings, payments, and session questions",
    color: "bg-violet-50 text-violet-600 dark:bg-violet-950/45 dark:text-violet-300",
  },
  {
    icon: GraduationCap,
    label: "Tutor Help",
    value: "Profiles, courses, and availability setup",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/45 dark:text-blue-300",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Messages are reviewed on working days",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/45 dark:text-emerald-300",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[56vh] overflow-hidden">
        <Image
          src="/book-with-green-board-background_1150-3837.jpg"
          alt="Contact Us"
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-indigo-900/60" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 py-16 text-center text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-200">
            Get In Touch
          </p>
          <h1 className="mb-4 max-w-3xl text-4xl font-extrabold drop-shadow-lg md:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-xl text-lg text-indigo-100 drop-shadow">
            Have a question or need help? Send the details and our team can follow the thread.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-3 text-2xl font-bold">We&apos;d love to hear from you</h2>
                <p className="text-muted-foreground">
                  Whether you&apos;re a student looking for help, a tutor wanting to join our
                  platform, or just have a general question, write what you need and we will route it.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 border bg-card/90 p-5 shadow-sm dark:bg-card"
                    >
                      <div className={`rounded-xl p-2.5 ${item.color}`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-hidden border bg-muted/35 p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Helpful note</p>
                <p className="mt-3 text-xl font-semibold">A little context gets a better answer.</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Include the page, booking, course, or tutor name connected to your question when you message support.
                </p>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div className="border bg-card/90 p-8 shadow-sm dark:bg-card">
              <h2 className="mb-6 text-xl font-bold">Send us a message</h2>
              <form className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    className="min-h-[140px] resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2">
                  <Send className="size-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
