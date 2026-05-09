import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@skillbridge.com",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Learning Ave, San Francisco, CA 94102",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon–Fri, 9 AM – 6 PM (PST)",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-200">
            Get In Touch
          </p>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-xl text-lg text-indigo-100">
            Have a question or need help? Our team is ready to assist you — reach out any time.
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
                  platform, or just have a general question — we&apos;re here for you.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 rounded-2xl border bg-background p-5 shadow-sm"
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

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-50 to-violet-50 p-8 text-center">
                <MapPin className="mx-auto mb-3 size-10 text-indigo-400" />
                <p className="font-semibold text-indigo-700">San Francisco, CA</p>
                <p className="mt-1 text-sm text-muted-foreground">123 Learning Avenue</p>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div className="rounded-2xl border bg-background p-8 shadow-sm">
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
